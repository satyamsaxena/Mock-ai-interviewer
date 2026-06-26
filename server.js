require('dotenv').config();
const express  = require('express');
const Groq     = require('groq-sdk');
const path     = require('path');
const crypto   = require('crypto');
const fs       = require('fs');
const multer   = require('multer');
const session  = require('express-session');
const Database = require('better-sqlite3');

// Determine where to store the database file.
// On Vercel the filesystem is read-only except for /tmp, so we use that.
// Locally we keep it inside a data/ folder next to this file.
const DATA_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
const DB_PATH  = path.join(DATA_DIR, 'interviews.db');

// Make sure the data directory exists before opening the database
try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
} catch (e) {
    // If creating the folder fails we still attempt to open the database
}

// Open (or create) the SQLite database file
const db = new Database(DB_PATH);

// Create the users table if it does not already exist
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        name       TEXT NOT NULL,
        email      TEXT,
        mobile     TEXT,
        created_at TEXT DEFAULT (datetime('now'))
    );
`);

// Create the interviews table if it does not already exist
db.exec(`
    CREATE TABLE IF NOT EXISTS interviews (
        id                 TEXT PRIMARY KEY,
        user_id            INTEGER,
        name               TEXT,
        email              TEXT,
        mobile             TEXT,
        role               TEXT,
        type               TEXT,
        started_at         TEXT,
        completed_at       TEXT,
        questions_answered INTEGER DEFAULT 0,
        overall_score      REAL,
        grade              TEXT,
        recommendation     TEXT,
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);

// Prepare frequently used SQL statements once so they are fast to run
const stmtFindUser      = db.prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
const stmtInsertUser    = db.prepare('INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)');
const stmtUpsertInterview = db.prepare(`
    INSERT OR REPLACE INTO interviews
        (id, user_id, name, email, mobile, role, type,
         started_at, completed_at, questions_answered,
         overall_score, grade, recommendation)
    VALUES
        (@id, @user_id, @name, @email, @mobile, @role, @type,
         @started_at, @completed_at, @questions_answered,
         @overall_score, @grade, @recommendation)
`);
const stmtAllInterviews = db.prepare('SELECT * FROM interviews ORDER BY completed_at DESC');

// Save a completed interview to the database.
// If the candidate has an email we try to reuse their existing user record,
// otherwise we create a new one.
function saveRecord(record) {
    let userId = null;

    if (record.email) {
        const existing = stmtFindUser.get(record.email);
        if (existing) {
            userId = existing.id;
        } else {
            const info = stmtInsertUser.run(record.name || '', record.email, record.mobile || '');
            userId = info.lastInsertRowid;
        }
    } else {
        // No email available, create an anonymous user row
        const info = stmtInsertUser.run(record.name || '', null, record.mobile || '');
        userId = info.lastInsertRowid;
    }

    stmtUpsertInterview.run({
        id:                 record.id,
        user_id:            userId,
        name:               record.name || null,
        email:              record.email || null,
        mobile:             record.mobile || null,
        role:               record.role || null,
        type:               record.type || null,
        started_at:         record.startedAt || null,
        completed_at:       record.completedAt || null,
        questions_answered: record.questionsAnswered || 0,
        overall_score:      record.overallScore || null,
        grade:              record.grade || null,
        recommendation:     record.recommendation || null,
    });
}

// Fetch all interview records ordered from most recent to oldest
function loadRecords() {
    return stmtAllInterviews.all();
}


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Set up session middleware used for admin login
// The secret should be changed via the SESSION_SECRET environment variable in production
app.use(session({
    secret: process.env.SESSION_SECRET || 'interviewai-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 8 * 60 * 60 * 1000 }  // sessions last 8 hours
}));

// Admin credentials read from environment variables with safe fallback defaults
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Middleware that protects admin routes.
// If the visitor is not logged in they are sent to the login page.
function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
}

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

// List of AI models to try in order when making Groq API calls
const MODELS = [
    { id: 'llama-3.3-70b-versatile',                        label: 'Llama 3.3 70B'     },
    { id: 'meta-llama/llama-4-scout-17b-16e-instruct',      label: 'Llama 4 Scout'     },
    { id: 'meta-llama/llama-4-maverick-17b-128e-instruct',  label: 'Llama 4 Maverick'  },
    { id: 'mixtral-8x7b-32768',                             label: 'Mixtral 8x7B'      },
    { id: 'llama-3.1-8b-instant',                           label: 'Llama 3.1 8B'      },
    { id: 'gemma2-9b-it',                                   label: 'Gemma 2 9B'        },
];
const modelCooldown = new Map();   // tracks when each model becomes available again
let   activeModelIdx = 0;

function isCoolingDown(id) {
    const until = modelCooldown.get(id);
    return until && Date.now() < until;
}

function markCooldown(id, isDaily) {
    const ms = isDaily ? 2 * 3600_000 : 5 * 60_000;   // 2 hours for daily limit, 5 minutes for per-minute limit
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

// Fix truncated JSON strings returned by the AI by closing any open brackets or quotes
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

// Parse AI response text into a JavaScript object, handling markdown fences and truncation
function parseJSON(text) {
    let c = text.trim()
        .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
        .replace(/<think>[\s\S]*?<\/think>/gi, '').trim()   // remove DeepSeek R1 chain-of-thought blocks
        .replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");

    try { return JSON.parse(c); } catch {}
    try { return JSON.parse(closeTruncatedJSON(c)); } catch {}
    const m = c.match(/\{[\s\S]*/);
    if (m) { try { return JSON.parse(closeTruncatedJSON(m[0])); } catch {} }

    throw new Error('JSON parse failed. Raw: ' + c.slice(0, 300));
}

// Call the Groq API and automatically fall back to another model if one is rate-limited
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
                markCooldown(id, true);   // treat an unavailable model like a long cooldown
                console.warn(`  [model-err] ${label} not available - trying next`);
                lastErr = err;
                continue;
            }

            throw err;   // any other error is not retryable, let it bubble up
        }
    }

    throw new Error(
        'All AI models are currently rate-limited. Please wait a few minutes and try again.\n' +
        (lastErr?.message || '')
    );
}

// Parse an uploaded resume file and return its text content
app.post('/api/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const { buffer, originalname, mimetype } = req.file;
        const name = originalname.toLowerCase();
        let text = '';

        if (name.endsWith('.pdf') || mimetype === 'application/pdf') {
            const PDFParser = require('pdf2json');
            text = await new Promise((resolve, reject) => {
                const parser = new PDFParser(null, true);
                parser.on('pdfParser_dataReady', () => resolve(parser.getRawTextContent()));
                parser.on('pdfParser_dataError', reject);
                parser.parseBuffer(buffer);
            });
        } else if (name.endsWith('.docx') || mimetype.includes('wordprocessingml')) {
            const mammoth = require('mammoth');
            const result = await mammoth.extractRawText({ buffer });
            text = result.value;
        } else {
            text = buffer.toString('utf-8');
        }

        // Collapse excessive whitespace so the text is clean before sending to the AI
        text = text.replace(/\s{3,}/g, '\n\n').trim();
        res.json({ text: text.slice(0, 3000), chars: text.length });
    } catch (err) {
        console.error('[/api/parse-resume]', err.message);
        res.status(500).json({ error: 'Could not parse resume: ' + err.message });
    }
});

// Start a new interview session and return the first question
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
        // Remove the session from memory after 90 minutes of inactivity
        setTimeout(() => sessions.delete(sessionId), 90 * 60 * 1000);

        res.json({ sessionId, model, ...data });
    } catch (err) {
        console.error('[/api/start]', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Accept a candidate answer, evaluate it, and return the next question or final report
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
            // Save the completed interview to the database
            try {
                saveRecord({
                    id:                sessionId,
                    name:              session.name,
                    email:             session.email,
                    mobile:            session.mobile,
                    role:              session.role,
                    type:              session.type,
                    startedAt:         session.startedAt,
                    completedAt:       new Date().toISOString(),
                    questionsAnswered: session.answerCount,
                    overallScore:      data.report?.overallScore ?? null,
                    grade:             data.report?.grade ?? null,
                    recommendation:    data.report?.recommendation ?? null,
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

// Return a hint and explanation for a question the candidate is stuck on
app.post('/api/hint', async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ error: 'sessionId required' });

        const session = sessions.get(sessionId);
        if (!session) return res.status(404).json({ error: 'Session not found or expired' });

        // Find the text of the most recent question from the AI history
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

// Translate text to Hindi using the free Google Translate endpoint
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


// Show the admin login page, or redirect to the dashboard if already logged in
app.get('/admin/login', (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Handle the login form submission
app.post('/admin/login', express.urlencoded({ extended: false }), (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    res.redirect('/admin/login?error=1');
});

// Log the admin out by destroying the session and sending them back to the login page
app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/admin/login');
    });
});

// Serve the admin dashboard page (login required)
app.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Return all interview records as JSON for the admin dashboard (login required)
app.get('/api/admin/data', requireAdmin, (req, res) => {
    res.json(loadRecords());
});


// Only start the HTTP server when running locally.
// On Vercel the platform invokes the exported app handler directly.
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`\n  InterviewAI -> http://localhost:${PORT}\n`);
        if (!process.env.GROQ_API_KEY) console.warn('  WARNING: GROQ_API_KEY not set\n');
    });
}

module.exports = app;
