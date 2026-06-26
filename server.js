require('dotenv').config();
const express  = require('express');
const Groq     = require('groq-sdk');
const path     = require('path');
const crypto   = require('crypto');
const fs       = require('fs');
const multer   = require('multer');

/* ── Persistent data store ── */
// On Vercel the filesystem is read-only; use /tmp (ephemeral but avoids crashes)
const DATA_DIR  = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'interviews.json');
try { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); } catch {}

function loadRecords() {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch { return []; }
}
function saveRecord(record) {
    const records = loadRecords();
    records.push(record);
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

let groq;
function getGroq() {
    if (!groq) {
        if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY environment variable is not set');
        groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    return groq;
}
const sessions = new Map();
const upload   = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

/* ── Multi-model fallback pool ── */
const MODELS = [
    { id: 'llama-3.3-70b-versatile',                        label: 'Llama 3.3 70B'     },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct',      label: 'Llama 4 Scout'     },
    { id: 'meta-llama/llama-4-maverick-17b-128e-instruct',  label: 'Llama 4 Maverick'  },
    { id: 'mixtral-8x7b-32768',                             label: 'Mixtral 8x7B'      },
    { id: 'llama-3.1-8b-instant',                           label: 'Llama 3.1 8B'      },
    { id: 'gemma2-9b-it',                                   label: 'Gemma 2 9B'        },
];
const modelCooldown = new Map();   // modelId -> cooldown-until ms timestamp
let   activeModelIdx = 0;

function isCoolingDown(id) {
    const until = modelCooldown.get(id);
    return until && Date.now() < until;
}

function markCooldown(id, isDaily) {
    const ms = isDaily ? 2 * 3600_000 : 5 * 60_000;   // 2 h daily | 5 min per-minute
    modelCooldown.set(id, Date.now() + ms);
    return ms;
}

const TYPE_DESCRIPTIONS = {
    'software-engineering': 'Software Engineering - data structures, algorithms, OOP, design patterns, testing, time/space complexity, coding best practices',
    'data-science':         'Data Science & ML - statistics, machine learning, model evaluation, Python/pandas, feature engineering, SQL, A/B testing, deep learning concepts',
    'behavioral':           'Behavioral - STAR method, leadership, conflict resolution, problem-solving, communication, teamwork, growth mindset',
    'frontend':             'Frontend Development - React/Vue/Angular, HTML5, CSS3, JavaScript ES6+, TypeScript, browser APIs, performance, accessibility, testing',
    'backend':              'Backend Development - REST APIs, authentication (JWT/OAuth), databases, caching (Redis), Node.js/Python/Java, microservices, message queues, error handling',
    'devops':               'DevOps & Cloud - Docker, Kubernetes, CI/CD pipelines, AWS/GCP/Azure, Infrastructure as Code, monitoring, deployment strategies, site reliability',
    'mobile':               'Mobile Development - iOS (Swift/UIKit/SwiftUI), Android (Kotlin/Jetpack), React Native, Flutter, mobile UX patterns, performance profiling, app store deployment',
    'database':             'Database & SQL - SQL queries, JOINs, window functions, indexing, normalization, transactions (ACID), NoSQL (MongoDB/Redis/Cassandra), query optimization, sharding',
    'cybersecurity':        'Cybersecurity - OWASP Top 10, authentication/authorization, encryption, XSS/CSRF/injection prevention, penetration testing concepts, secure coding, threat modeling',
    'system-design':        'System Design - distributed systems, scalability, CAP theorem, load balancing, caching strategies, microservices, API design, database sharding, CDN, message brokers',
    'product':              'Product Management - product sense, metrics/OKRs, roadmap prioritization, user research, A/B testing, PRDs, stakeholder management, go-to-market strategy',
    'all':                  'Full Stack Interview - balanced mix: 2 Software Engineering, 2 System Design, 2 Frontend/Backend, 2 Data Science, 2 Behavioral'
};

function buildSystemPrompt(name, role, type, resumeText) {
    const resumeSection = resumeText ? `
CANDIDATE RESUME / BACKGROUND:
"""
${resumeText.slice(0, 2500)}
"""
IMPORTANT: Use this resume to:
1. Ask about specific technologies, frameworks, and projects mentioned above.
2. Reference their actual experience when crafting questions (e.g., if they list React, ask a React-specific question).
3. Calibrate difficulty based on their seniority (years of experience, role level).
4. In feedback, reference their background: "Given your experience with X, you should also know Y."
` : '';

    return `You are Alex, a senior technical interviewer at a top-tier tech company conducting a realistic mock interview.

Candidate: ${name}
Target Role: ${role}
Interview Type: ${TYPE_DESCRIPTIONS[type] || TYPE_DESCRIPTIONS['all']}
${resumeSection}
STRICT RULES:
1. Ask exactly 10 questions. Track internally.
2. Output ONLY valid JSON - no prose, no markdown fences.
3. Difficulty: Q1-Q2 easy, Q3-Q5 medium, Q6-Q10 hard.
4. Diverse topics - never repeat a skill area.
5. All string values: plain text, no escaped quotes inside strings.

SCORING: 1-3 Poor | 4-5 Fair | 6-7 Good | 8-9 Excellent | 10 Outstanding
Grades: 9-10=A+ Strong Hire | 8-8.9=A Strong Hire | 7-7.9=B+ Hire | 6-6.9=B Hire | 5-5.9=C+ Consider | 4-4.9=C Consider | <4=No Hire

SKILL AREAS (pick one per question):
algorithms | system-design | frontend | backend | data-science | behavioral | devops | mobile | database | cybersecurity | product

QUESTION BANK (draw from these, never repeat, prioritize resume-mentioned skills):
Algorithms: two-pointer technique, sliding window, binary search variations, BST operations, graph BFS/DFS, dynamic programming (fibonacci/knapsack), hash maps for O(1) lookup, merge sort vs quicksort, stack/queue implementation, time-space complexity tradeoffs, trie data structure.
System Design: URL shortener design, distributed chat application, rate limiter implementation, CDN architecture, CAP theorem application, consistent hashing, load balancer types, database sharding strategies, event-driven vs request-driven architecture, search autocomplete system, notification system.
Frontend: React useState vs useEffect, React Context vs Redux, virtual DOM reconciliation, CSS Box Model and specificity, Flexbox vs CSS Grid, JavaScript event loop and call stack, promises vs async-await, lazy loading and code splitting, web accessibility WCAG, TypeScript generics, service workers and PWA, micro-frontend architecture.
Backend: RESTful API design principles, JWT vs session authentication, OAuth 2.0 flow, database connection pooling, Redis caching patterns, Kafka vs RabbitMQ message queues, API rate limiting strategies, gRPC vs REST, Node.js event loop, Python GIL, input sanitization, middleware design pattern, GraphQL advantages.
Data Science: bias-variance tradeoff in depth, L1 vs L2 regularization, gradient descent variants, precision vs recall tradeoffs, feature selection methods, handling class imbalance (SMOTE), cross-validation strategies, time series forecasting (ARIMA), recommendation systems (collaborative/content filtering), SQL window functions (RANK/LAG/LEAD), model deployment challenges.
Behavioral: conflict with coworker resolution, most challenging technical project, failure and specific lessons learned, leading without formal authority, prioritizing under tight deadline, receiving and acting on critical feedback, handling ambiguous requirements, cross-functional collaboration, mentoring junior developers, advocating for technical debt paydown.
DevOps: Docker containers vs virtual machines, Kubernetes pods/deployments/services, CI/CD pipeline design (GitHub Actions/Jenkins), blue-green vs canary deployments, Infrastructure as Code (Terraform/Ansible), AWS services (EC2/S3/Lambda/RDS), Prometheus + Grafana monitoring, log aggregation (ELK stack), secrets management (Vault), disaster recovery strategies, SLA/SLO/SLI definitions.
Mobile: React Native bridge vs native modules, iOS memory management (ARC), Android activity lifecycle, state management in mobile (Redux/MobX/Riverpod), push notification implementation (APNs/FCM), deep linking and universal links, offline-first architecture, mobile performance profiling, app store review guidelines, SwiftUI vs UIKit tradeoffs, Jetpack Compose basics.
Database: SQL INNER/LEFT/RIGHT JOINs with examples, window functions (RANK/DENSE_RANK/ROW_NUMBER), B-tree vs hash indexes, query execution plan analysis, database normalization (1NF through BCNF), ACID vs BASE properties, MongoDB aggregation pipeline, Redis data structures (sorted sets/hashes), database replication vs sharding, PostgreSQL vs MySQL differences, connection pooling strategies.
Cybersecurity: SQL injection prevention and parameterized queries, XSS types (stored/reflected/DOM) and mitigation, CSRF attack and token protection, HTTPS/TLS handshake process, bcrypt vs Argon2 for password hashing, JWT security pitfalls, OAuth 2.0 security considerations, CORS policy configuration, Content Security Policy headers, OWASP Top 10 walk-through, secrets management best practices, penetration testing methodology.
Product: defining success metrics for a new feature, backlog prioritization frameworks (RICE/MoSCoW), designing an A/B experiment from scratch, analyzing user drop-off in a funnel, handling conflicting stakeholder requests, creating a 6-month product roadmap, defining OKRs for a product team, product sense question (improve feature X), go-to-market strategy for a new product, balancing technical debt vs new features.

HINTS RULES (apply to every question):
- "How to Answer": 2-3 sentences explaining exact structure - what to say first, second, third. Include a sample opening sentence.
- "Key Concepts": 4-5 specific technical points each followed by a one-sentence explanation of what it means and why it matters.
- "Common Mistake": The single most damaging mistake candidates make on this exact question, why it kills the score, and how to avoid it.
- "What Scores 9/10": Specific technical depth, exact tradeoffs, or concrete real-world example that elevates an average answer to outstanding.
- When technical (code/algorithms/SQL/frontend/backend): add optional "code":{"language":"<lang>","snippet":"<5-10 clean lines>"} to the most relevant hint card. Skip for behavioral/product questions.

SAMPLE ANSWERS RULES:
- "Good" answer (7/10): Complete 4-5 sentence answer that fully addresses the question at a solid level with one concrete example. Must be submittable as-is.
- "Expert" answer (9/10): Complete 5-7 sentence answer with precise technical terms, specific tradeoffs, real-world context, and nuanced insight. Must be submittable as-is.

FORMAT 1 - First question (when user says Begin the interview):
{"type":"question","number":1,"total":10,"topic":"<topic>","skillArea":"<area>","difficulty":"easy","question":"<question>","hints":[{"title":"How to Answer","detail":"<2-3 sentences with exact structure + sample opening sentence>"},{"title":"Key Concepts","detail":"<4-5 technical points each with one-sentence explanation>"},{"title":"Common Mistake","detail":"<specific mistake on this exact question, why it hurts, how to avoid>"},{"title":"What Scores 9/10","detail":"<specific depth, tradeoff, or example that separates great from average>"}],"sampleAnswers":[{"level":"Good","score":"7/10","answer":"<complete 4-5 sentence answer, technically correct, one example, submittable as-is>"},{"level":"Expert","score":"9/10","answer":"<complete 5-7 sentence answer with depth, tradeoffs, real-world example, nuanced insight, submittable as-is>"}]}

FORMAT 2 - After answers 1-9:
{"type":"evaluation_and_question","evaluation":{"score":<1-10>,"label":"<Poor|Fair|Good|Excellent|Outstanding>","feedback":"<2-3 honest sentences>","strengths":["<specific strength>","<another>"],"improvements":["<specific gap>","<another>"],"idealAnswer":"<comprehensive 2-3 sentence model answer with concrete example>","suggestions":["<study tip>","<practice tip>","<resource>"]},"nextQuestion":{"number":<n>,"total":10,"topic":"<topic>","skillArea":"<area>","difficulty":"<easy|medium|hard>","question":"<question>","hints":[{"title":"How to Answer","detail":"<2-3 sentences with exact structure + sample opener>"},{"title":"Key Concepts","detail":"<4-5 technical points each with one-sentence explanation>"},{"title":"Common Mistake","detail":"<specific mistake on this exact question and how to avoid>"},{"title":"What Scores 9/10","detail":"<depth or tradeoff that separates great answers>"}],"sampleAnswers":[{"level":"Good","score":"7/10","answer":"<complete 4-5 sentence answer, submittable as-is>"},{"level":"Expert","score":"9/10","answer":"<complete 5-7 sentence answer with depth and tradeoffs, submittable as-is>"}]}}

FORMAT 3 - After answer 10 (final):
{"type":"evaluation_and_report","evaluation":{"score":<1-10>,"label":"<label>","feedback":"<2-3 sentences>","strengths":["<s>","<s>"],"improvements":["<i>","<i>"],"idealAnswer":"<model answer with example>","suggestions":["<t>","<t>","<t>"]},"report":{"overallScore":<1.0-10.0>,"grade":"<A+|A|B+|B|C+|C|D|F>","recommendation":"<Strong Hire|Hire|Consider|No Hire>","summary":"<holistic 2-3 sentences>","topStrengths":["<s>","<s>","<s>"],"topImprovements":["<i>","<i>","<i>"],"questionBreakdown":[{"number":1,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":2,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":3,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":4,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":5,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":6,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":7,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":8,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":9,"topic":"<t>","skillArea":"<a>","score":<n>},{"number":10,"topic":"<t>","skillArea":"<a>","score":<n>}],"nextSteps":"<personalised 2-3 sentence study advice>"}}`;
}

/* ── JSON helpers ── */
function closeTruncatedJSON(s) {
    const stack = [];
    let inStr = false, esc = false;
    for (const ch of s) {
        if (esc)             { esc = false; continue; }
        if (ch === '\\' && inStr) { esc = true; continue; }
        if (ch === '"')      { inStr = !inStr; continue; }
        if (inStr)           continue;
        if (ch === '{')      stack.push('}');
        else if (ch === '[') stack.push(']');
        else if (ch === '}' || ch === ']') stack.pop();
    }
    if (inStr) s += '"';
    while (stack.length) s += stack.pop();
    return s;
}

function parseJSON(text) {
    let c = text.trim()
        .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
        .replace(/<think>[\s\S]*?<\/think>/gi, '').trim()   // strip DeepSeek R1 reasoning
        .replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

    try { return JSON.parse(c); } catch {}
    try { return JSON.parse(closeTruncatedJSON(c)); } catch {}
    const m = c.match(/\{[\s\S]*/);
    if (m) { try { return JSON.parse(closeTruncatedJSON(m[0])); } catch {} }

    throw new Error('JSON parse failed. Raw: ' + c.slice(0, 300));
}

/* ── Multi-model Groq call with automatic fallback ── */
async function callGroq(messages, maxTokens = 4096) {
    let lastErr = null;

    for (let attempt = 0; attempt < MODELS.length; attempt++) {
        const idx           = (activeModelIdx + attempt) % MODELS.length;
        const { id, label } = MODELS[idx];

        if (isCoolingDown(id)) {
            console.log(`  [model] ${label} cooling down - skipping`);
            continue;
        }

        try {
            const r = await getGroq().chat.completions.create({
                model: id, messages,
                temperature: 0.7, max_tokens: maxTokens
            });

            if (attempt > 0) {
                activeModelIdx = idx;
                console.log(`  [model] switched to ${label}`);
            }

            return { content: r.choices[0].message.content, model: label };
        } catch (err) {
            const msg        = err.message || '';
            const is429      = err.status === 429 || msg.includes('429') || msg.includes('rate_limit_exceeded');
            const isModelErr = err.status === 404 ||
                /decommissioned|model_decommissioned|model_not_found/i.test(msg) ||
                /model.*(not found|unavailable|decommissioned)/i.test(msg);

            if (is429) {
                const isDaily = /tokens per day|per day|TPD/i.test(msg);
                const coolMs  = markCooldown(id, isDaily);
                console.warn(`  [rate-limit] ${label} (${isDaily ? 'daily' : 'per-min'}, ${Math.round(coolMs/60000)}min cooldown) - trying next`);
                lastErr = err;
                continue;
            }

            if (isModelErr) {
                markCooldown(id, true);   // treat unavailable model as long cooldown
                console.warn(`  [model-err] ${label} not available - trying next`);
                lastErr = err;
                continue;
            }

            throw err;   // non-retryable error bubbles up
        }
    }

    throw new Error(
        'All AI models are currently rate-limited. Please wait a few minutes and try again.\n' +
        (lastErr?.message || '')
    );
}

/* ══ Resume parse endpoint ══ */
app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { buffer, originalname, mimetype } = req.file;
        const name = originalname.toLowerCase();
        let text = '';

        if (name.endsWith('.pdf') || mimetype === 'application/pdf') {
            const pdfParse = require('pdf-parse');
            const data = await pdfParse(buffer);
            text = data.text;
        } else if (name.endsWith('.docx') || mimetype.includes('wordprocessingml')) {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            text = buffer.toString('utf-8');
        }

        // Normalise whitespace
        text = text.replace(/\s{3,}/g, '\n\n').trim();
        res.json({ text: text.slice(0, 3000), chars: text.length });
    } catch (err) {
        console.error('[/api/parse-resume]', err.message);
        res.status(500).json({ error: 'Could not parse resume: ' + err.message });
    }
});

/* ══ Start interview ══ */
app.post('/api/start', async (req, res) => {
    try {
        const { name, mobile, email, role, type, resumeText } = req.body;
        if (!name || !role || !type) return res.status(400).json({ error: 'name, role, and type are required' });

        const sessionId    = crypto.randomUUID();
        const systemPrompt = buildSystemPrompt(name, role, type, resumeText || '');
        const history      = [{ role: 'user', content: 'Begin the interview.' }];

        const messages = [{ role: 'system', content: systemPrompt }, ...history];
        const { content, model } = await callGroq(messages);
        const data = parseJSON(content);

        history.push({ role: 'assistant', content });
        sessions.set(sessionId, {
            name, mobile: mobile || '', email: email || '',
            role, type, systemPrompt, history, answerCount: 0,
            startedAt: new Date().toISOString()
        });
        setTimeout(() => sessions.delete(sessionId), 90 * 60 * 1000);

        res.json({ sessionId, model, ...data });
    } catch (err) {
        console.error('[/api/start]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ══ Submit answer ══ */
app.post('/api/answer', async (req, res) => {
    try {
        const { sessionId, answer } = req.body;
        if (!sessionId || !answer) return res.status(400).json({ error: 'sessionId and answer required' });

        const session = sessions.get(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found or expired' });

        session.history.push({ role: 'user', content: answer.trim() });
        session.answerCount++;

        const messages = [{ role: 'system', content: session.systemPrompt }, ...session.history];
        const { content, model } = await callGroq(messages);
        session.history.push({ role: 'assistant', content });

        const data = parseJSON(content);

        if (data.type === 'evaluation_and_question') {
            res.json({ feedback: data.evaluation, next: data.nextQuestion, model });
        } else if (data.type === 'evaluation_and_report') {
            // Persist completed interview record
            try {
                saveRecord({
                    id:               sessionId,
                    timestamp:        new Date().toISOString(),
                    name:             session.name,
                    email:            session.email,
                    mobile:           session.mobile,
                    role:             session.role,
                    type:             session.type,
                    startedAt:        session.startedAt,
                    completedAt:      new Date().toISOString(),
                    questionsAnswered: session.answerCount,
                    overallScore:     data.report?.overallScore ?? null,
                    grade:            data.report?.grade ?? null,
                    recommendation:   data.report?.recommendation ?? null,
                });
            } catch(e) { console.warn('[save-record]', e.message); }

            res.json({ feedback: data.evaluation, report: data.report, model });
        } else {
            res.status(500).json({ error: 'Unexpected AI response format: ' + data.type });
        }
    } catch (err) {
        console.error('[/api/answer]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ══ Hint - I don't know ══ */
app.post('/api/hint', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

        const session = sessions.get(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found or expired' });

        // Extract the current question text from the last AI message
        let questionText = 'this topic';
        const lastAsst = [...session.history].reverse().find(m => m.role === 'assistant');
        if (lastAsst) {
            try {
                const p = parseJSON(lastAsst.content);
                questionText = p.question || p.nextQuestion?.question || questionText;
            } catch {}
        }

        const { content } = await callGroq([{
            role: 'user',
            content: `A candidate doesn't know the answer to this interview question: "${questionText}"

Explain the concept clearly and helpfully. Output ONLY valid JSON (no markdown fences):
{"type":"explanation","topic":"<short topic name>","explanation":"<2-3 clear sentences explaining the core concept>","keyPoints":["<key point 1>","<key point 2>","<key point 3>"],"example":"<one concrete real-world example>","hint":"<how to structure an answer to this specific question>","codeSnippet":{"language":"<javascript|python|sql|etc>","snippet":"<5-12 clean relevant lines>"},"diagram":"<optional mermaid diagram syntax e.g. flowchart TD\\n  A[Browser] --> B[Server]>"}`
        }], 1200);

        const data = parseJSON(content);
        res.json(data);
    } catch (err) {
        console.error('[/api/hint]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ══ Hindi translation (Google Translate free endpoint) ══ */
app.post('/api/translate', async (req, res) => {
    const { text } = req.body;
    if (!text || !text.trim()) return res.json({ hindi: '' });
    try {
        const encoded = encodeURIComponent(text.trim());
        const url     = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encoded}`;
        const hindi   = await new Promise((resolve, reject) => {
            require('https').get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
                let raw = '';
                r.on('data', c => raw += c);
                r.on('end', () => {
                    try {
                        const data = JSON.parse(raw);
                        resolve((data[0] || []).map(seg => seg?.[0] || '').join(''));
                    } catch(e) { reject(new Error('Parse error: ' + raw.slice(0, 120))); }
                });
            }).on('error', reject);
        });
        res.json({ hindi });
    } catch (err) {
        console.error('[/api/translate]', err.message);
        res.status(500).json({ error: err.message });
    }
});

/* ══════════════════════════════════════
   Admin Panel Routes
══════════════════════════════════════ */
app.use(express.urlencoded({ extended: false }));

/* Data API — open to localhost, protect in production via ADMIN_KEY query param */
app.get('/api/admin/data', (req, res) => {
    res.json(loadRecords());
});

/* Admin dashboard — served directly, no login required */
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Only bind a port when running locally (Vercel invokes the handler directly)
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n  InterviewAI → http://localhost:${PORT}\n`);
        if (!process.env.GROQ_API_KEY) console.warn('  ⚠  GROQ_API_KEY not set\n');
    });
}

module.exports = app;
