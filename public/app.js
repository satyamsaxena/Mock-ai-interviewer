/* ══════════════════════════════════════
   Inline Icon System
══════════════════════════════════════ */
const ICONS = {
    'zap':           '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'mic':           '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    'mic-off':       '<line x1="2" x2="22" y1="2" y2="22"/><path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/><path d="M5 10v2a7 7 0 0 0 12 5"/><path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12"/><line x1="12" x2="12" y1="19" y2="22"/>',
    'bar-chart-2':   '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
    'sparkles':      '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
    'user':          '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    'briefcase':     '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'code-2':        '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    'line-chart':    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    'users':         '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'layers':        '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    'arrow-right':   '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'volume-2':      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>',
    'volume-x':      '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" x2="17" y1="9" y2="15"/><line x1="17" x2="23" y1="9" y2="15"/>',
    'message-square':'<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'send':          '<line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>',
    'check-circle-2':'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'trending-up':   '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',
    'lightbulb':     '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    'shield-check':  '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    'target':        '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'list':          '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
    'compass':       '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'refresh-cw':    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
    'book-open':     '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'key':           '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    'alert-circle':  '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    'upload-cloud':  '<polyline points="16 16 12 12 8 16"/><line x1="12" x2="12" y1="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
    'file-text':     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'x':             '<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>',
    'help-circle':   '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
    'linkedin':       '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    'thumbs-up':      '<path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    'award':          '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
    'clipboard-copy': '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/>',
    'monitor':       '<rect width="20" height="14" x="2" y="3" rx="2" ry="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>',
    'server':        '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    'cloud':         '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
    'smartphone':    '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><line x1="12" x2="12.01" y1="18" y2="18"/>',
    'database':      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
    'shield':        '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'layout':        '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/>',
    'package':       '<line x1="16.5" x2="7.5" y1="9.4" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/>',
    'phone':         '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.83a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'mail':          '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
};

function svgWrap(paths) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function renderIcons(root) {
    (root || document).querySelectorAll('[data-lucide]').forEach(el => {
        const name = el.getAttribute('data-lucide');
        if (ICONS[name]) el.innerHTML = svgWrap(ICONS[name]);
    });
}

/* ── Animation helpers ── */
function animIn(el) {
    if (!el) return;
    el.classList.remove('anim-in');
    void el.offsetWidth;
    el.classList.add('anim-in');
}

function animStagger(selector, parent) {
    const els = (parent || document).querySelectorAll(selector);
    els.forEach((el, i) => {
        el.style.animationDelay = `${i * 0.07}s`;
        el.classList.remove('anim-in');
        void el.offsetWidth;
        el.classList.add('anim-in');
    });
}

/* ══════════════════════════════════════
   Resume Upload
══════════════════════════════════════ */
let resumeText = null;

function initResumeUpload() {
    const dropZone    = document.getElementById('resume-drop');
    const fileInput   = document.getElementById('resume-file');
    const browseBtn   = document.getElementById('resume-browse-btn');
    const preview     = document.getElementById('resume-preview');
    const uploading   = document.getElementById('resume-uploading');
    const removeBtn   = document.getElementById('resume-remove');
    const filenameEl  = document.getElementById('resume-filename');

    browseBtn?.addEventListener('click', e => { e.preventDefault(); fileInput.click(); });
    dropZone?.addEventListener('click', e => { if (e.target !== browseBtn) fileInput.click(); });

    dropZone?.addEventListener('dragover',  e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone?.addEventListener('drop', async e => {
        e.preventDefault(); dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) await uploadResume(file);
    });

    fileInput?.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (file) await uploadResume(file);
        fileInput.value = '';
    });

    removeBtn?.addEventListener('click', () => {
        resumeText = null;
        preview.classList.add('hidden');
        dropZone.classList.remove('hidden');
        renderIcons();
    });

    async function uploadResume(file) {
        const maxBytes = 8 * 1024 * 1024;
        if (file.size > maxBytes) { alert('File too large. Max 8 MB.'); return; }

        dropZone.querySelector('.resume-drop-inner').classList.add('hidden');
        uploading.classList.remove('hidden');

        try {
            const fd = new FormData();
            fd.append('resume', file);
            const r = await fetch('/api/parse-resume', { method: 'POST', body: fd });
            const data = await r.json();
            if (!r.ok) throw new Error(data.error || 'Upload failed');

            resumeText = data.text;
            dropZone.classList.add('hidden');
            filenameEl.textContent = file.name;
            preview.classList.remove('hidden');
            renderIcons(preview);
        } catch (err) {
            alert('Resume parse error: ' + err.message);
            dropZone.querySelector('.resume-drop-inner').classList.remove('hidden');
        } finally {
            uploading.classList.add('hidden');
        }
    }
}

/* ══════════════════════════════════════
   State
══════════════════════════════════════ */
const TOTAL_QUESTIONS = 10;

const state = {
    sessionId:     null,
    scores:        [],
    skills:        {},   // skillArea → count
    qNum:          0,
    pendingNext:   null,
    pendingReport: null,
    ttsEnabled:    true,
    isRecording:   false,
    interviewType: 'all'
};

/* ══════════════════════════════════════
   Skill labels & colours
══════════════════════════════════════ */
const SKILL_META = {
    'algorithms':    { label: 'Algorithms / DSA',  color: '#6366f1' },
    'system-design': { label: 'System Design',     color: '#8b5cf6' },
    'frontend':      { label: 'Frontend Dev',      color: '#0ea5e9' },
    'backend':       { label: 'Backend Dev',       color: '#f97316' },
    'data-science':  { label: 'Data Science',      color: '#a855f7' },
    'behavioral':    { label: 'Behavioral',        color: '#ec4899' },
    'devops':        { label: 'DevOps & Cloud',    color: '#3b82f6' },
    'mobile':        { label: 'Mobile Dev',        color: '#7c3aed' },
    'database':      { label: 'Database & SQL',    color: '#14b8a6' },
    'cybersecurity': { label: 'Cybersecurity',     color: '#ef4444' },
    'product':       { label: 'Product Mgmt',      color: '#f59e0b' },
};

function updateSkillBar() {
    const card = document.getElementById('skills-card');
    const el   = document.getElementById('sb-skills');
    const total = Object.values(state.skills).reduce((a, b) => a + b, 0);
    if (!total) { card.classList.add('hidden'); return; }
    card.classList.remove('hidden');
    renderIcons(card);

    el.innerHTML = Object.entries(state.skills)
        .sort((a, b) => b[1] - a[1])
        .map(([area, count]) => {
            const meta = SKILL_META[area] || { label: area, color: '#6366f1' };
            const pct  = Math.round((count / total) * 100);
            return `<div class="skill-row">
                <span class="skill-label">${meta.label}</span>
                <div class="skill-bar-wrap">
                    <div class="skill-bar-fill" style="width:${pct}%;background:${meta.color}"></div>
                </div>
                <span class="skill-count">${count}Q</span>
            </div>`;
        }).join('');
}

/* ══════════════════════════════════════
   Screens
══════════════════════════════════════ */
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active'); s.style.display = 'none';
    });
    const t = document.getElementById(id);
    t.style.display = 'flex'; t.classList.add('active');
    window.scrollTo(0, 0);
    renderIcons();
}

/* ══════════════════════════════════════
   Helpers
══════════════════════════════════════ */
function scoreColor(s) {
    if (s >= 8) return 'var(--emerald)';
    if (s >= 6) return 'var(--indigo)';
    if (s >= 4) return 'var(--amber)';
    return 'var(--red)';
}
function scorePill(s) {
    if (s >= 8) return 'pill-green';
    if (s >= 6) return 'pill-indigo';
    if (s >= 4) return 'pill-amber';
    return 'pill-red';
}
function scoreLabel(s) {
    if (s >= 9) return 'Outstanding';
    if (s >= 8) return 'Excellent';
    if (s >= 6) return 'Good';
    if (s >= 4) return 'Fair';
    return 'Poor';
}
function diffChip(d) {
    return { easy: 'chip-easy', medium: 'chip-medium', hard: 'chip-hard' }[d] || 'chip-indigo';
}
function stripHTML(h) {
    const d = document.createElement('div'); d.innerHTML = h;
    return d.textContent || d.innerText || '';
}
async function api(url, body) {
    const r = await fetch(url, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || `HTTP ${r.status}`);
    return data;
}
function setLoading(on, text = 'Alex is reviewing your answer…') {
    document.getElementById('loading-text').textContent = text;
    document.getElementById('loading-overlay').classList.toggle('hidden', !on);
}

/* ══════════════════════════════════════
   Rich Content Renderer (code blocks + diagrams)
══════════════════════════════════════ */
let _mermaidReady = false;
function initMermaid() {
    if (_mermaidReady || typeof mermaid === 'undefined') return;
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose',
        themeVariables: { fontSize: '13px' } });
    _mermaidReady = true;
}

function escHtml(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderInlineText(text) {
    return escHtml(text)
        .replace(/`([^`\n]+)`/g, '<code class="rc-inline">$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
}

function buildCodeBlock(lang, snippet) {
    const safeSnippet = escHtml(snippet);
    const safeLang    = escHtml(lang || 'code');
    return `<div class="rc-code-block">
        <div class="rc-code-hdr">
            <span class="rc-code-lang">${safeLang}</span>
            <button class="rc-copy-btn" data-snippet="${safeSnippet}">Copy</button>
        </div>
        <pre class="rc-pre"><code class="language-${safeLang}">${safeSnippet}</code></pre>
    </div>`;
}

function renderRich(text) {
    if (!text) return '';
    const CODE_RE = /```(\w*)\n?([\s\S]*?)```/g;
    let result = '', lastIdx = 0, m;
    while ((m = CODE_RE.exec(text)) !== null) {
        if (m.index > lastIdx) result += `<span class="rc-text">${renderInlineText(text.slice(lastIdx, m.index))}</span>`;
        result += buildCodeBlock(m[1], m[2].trimEnd());
        lastIdx = m.index + m[0].length;
    }
    if (lastIdx < text.length) result += `<span class="rc-text">${renderInlineText(text.slice(lastIdx))}</span>`;
    return result;
}

async function renderMermaidBlock(container, definition) {
    initMermaid();
    if (typeof mermaid === 'undefined' || !definition?.trim()) return;
    try {
        const id  = 'mermaid-' + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, definition.trim());
        container.innerHTML = svg;
    } catch(e) {
        container.textContent = definition;
    }
}

function attachCopyBtns(root) {
    root.querySelectorAll('.rc-copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            navigator.clipboard.writeText(btn.dataset.snippet || '').then(() => {
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy', 1800);
            });
        });
    });
}

function highlightBlock(root) {
    if (typeof Prism !== 'undefined') {
        root.querySelectorAll('pre code[class*="language-"]').forEach(el => Prism.highlightElement(el));
    }
}

let _lastModel = '';
function setModel(modelName) {
    if (!modelName) return;
    const badge = document.getElementById('model-badge');
    if (!badge) return;
    const switched = _lastModel && _lastModel !== modelName;
    _lastModel = modelName;
    badge.textContent = modelName;
    badge.classList.remove('hidden');
    if (switched) {
        badge.classList.remove('switched');
        void badge.offsetWidth;   // force reflow for animation restart
        badge.classList.add('switched');
        setTimeout(() => badge.classList.remove('switched'), 800);
    }
}

/* ══════════════════════════════════════
   Hindi Answer Translation
══════════════════════════════════════ */
let ansHindiOn = false;
let ansOriginalText = '';          // saved English text while Hindi is shown
const hindiCache = new Map();      // english text → hindi translation

async function translateToHindi(text) {
    if (!text.trim()) return '';
    if (hindiCache.has(text)) return hindiCache.get(text);
    const data = await api('/api/translate', { text });
    const hindi = data.hindi || '';
    if (hindi) hindiCache.set(text, hindi);
    return hindi;
}

async function toggleAnswerHindi() {
    const textarea = document.getElementById('ans-input');
    const btn      = document.getElementById('ans-hindi-btn');
    const panel    = document.getElementById('ans-hindi-panel');

    if (!ansHindiOn) {
        // Turn ON — translate current textarea content
        const text = textarea.value.trim();
        if (!text) return;                // nothing to translate

        ansOriginalText = textarea.value;
        ansHindiOn = true;
        btn.classList.add('active');

        panel.textContent = '…';
        panel.classList.remove('hidden');

        try {
            const hindi = await translateToHindi(text);
            panel.textContent = hindi || text;
        } catch {
            panel.textContent = 'Translation failed.';
        }
    } else {
        // Turn OFF — restore English
        ansHindiOn = false;
        btn.classList.remove('active');
        panel.classList.add('hidden');
        panel.textContent = '';
    }
}

document.getElementById('ans-hindi-btn').addEventListener('click', toggleAnswerHindi);

// Reset Hindi panel on new question / answer submit
function resetAnswerHindi() {
    ansHindiOn = false;
    ansOriginalText = '';
    const btn   = document.getElementById('ans-hindi-btn');
    const panel = document.getElementById('ans-hindi-panel');
    if (btn)   { btn.classList.remove('active'); }
    if (panel) { panel.classList.add('hidden'); panel.textContent = ''; }
}

/* ══════════════════════════════════════
   Avatar - SVG mouth animation
══════════════════════════════════════ */
let speakInterval = null;

function startMouthAnim() {
    let phase = 0;
    speakInterval = setInterval(() => {
        const m0 = document.getElementById('av-m-0');
        const m2 = document.getElementById('av-m-2');
        const m3 = document.getElementById('av-m-3');
        if (!m2) return;
        m0?.classList.add('hidden');
        if (phase % 2 === 0) {
            m2.classList.remove('hidden'); m3.classList.add('hidden');
        } else {
            m2.classList.add('hidden'); m3.classList.remove('hidden');
        }
        phase++;
    }, 145);
}

function stopMouthAnim(nextState) {
    clearInterval(speakInterval); speakInterval = null;
    ['av-m-1', 'av-m-2', 'av-m-3'].forEach(id => document.getElementById(id)?.classList.add('hidden'));
    const m0 = document.getElementById('av-m-0');
    const m1 = document.getElementById('av-m-1');
    if (nextState === 'thinking') {
        m0?.classList.add('hidden'); m1?.classList.remove('hidden');
    } else {
        m0?.classList.remove('hidden');
    }
}

function setAvatarState(s) {
    const ring   = document.getElementById('avatar-ring');
    const bars   = document.getElementById('sound-bars');
    const dot    = document.getElementById('av-dot');
    const status = document.getElementById('av-status-text');

    stopMouthAnim(s);
    ring.className = `avatar-ring ${s}`;
    dot.className  = `av-dot ${s}`;
    bars.classList.toggle('active', s === 'speaking' || s === 'listening');

    const barEls = bars.querySelectorAll('.bar');
    barEls.forEach(b => b.style.background = s === 'listening' ? 'var(--emerald)' : 'var(--indigo)');

    const labels = { idle: 'Ready', speaking: 'Speaking…', listening: 'Listening…', thinking: 'Thinking…' };
    status.textContent = labels[s] || 'Ready';

    if (s === 'speaking') startMouthAnim();
}

/* ══════════════════════════════════════
   TTS - Female voice, clear accent
══════════════════════════════════════ */
async function speak(text, onEnd) {
    if (!state.ttsEnabled || !window.speechSynthesis) { onEnd?.(); return; }
    window.speechSynthesis.cancel();

    const plain = stripHTML(text).replace(/[\u2500-\u257F─]+/g, '').trim();
    if (!plain) { onEnd?.(); return; }

    const voices = await new Promise(res => {
        const v = speechSynthesis.getVoices();
        if (v.length) { res(v); return; }
        speechSynthesis.onvoiceschanged = () => res(speechSynthesis.getVoices());
    });

    // Prefer clear female English voices
    const femalePreferred = [
        'Samantha',               // macOS US female (clearest)
        'Google UK English Female',
        'Microsoft Zira',         // Windows US female
        'Karen',                  // macOS AU female
        'Moira',                  // macOS IE female
        'Victoria',               // macOS US female
        'Tessa',                  // macOS ZA female
        'Fiona',                  // macOS Scottish
    ];

    let voice = femalePreferred.reduce((found, name) =>
        found || voices.find(v => v.name.includes(name))
    , null);

    // Fallback: any English voice whose name doesn't suggest male
    if (!voice) {
        voice = voices.find(v =>
            v.lang.startsWith('en') && !/\b(male|man|david|mark|daniel|alex|fred|bruce|ralph)\b/i.test(v.name)
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    }

    const utt = new SpeechSynthesisUtterance(plain);
    utt.rate = 0.92; utt.pitch = 1.1; utt.volume = 1.0;
    if (voice) utt.voice = voice;

    const timer = setInterval(() => {
        if (!speechSynthesis.speaking) clearInterval(timer);
        else { speechSynthesis.pause(); speechSynthesis.resume(); }
    }, 10000);

    utt.onstart = () => setAvatarState('speaking');
    utt.onend   = () => { clearInterval(timer); setAvatarState('idle'); onEnd?.(); };
    utt.onerror = () => { clearInterval(timer); setAvatarState('idle'); onEnd?.(); };
    speechSynthesis.speak(utt);
}

function stopSpeaking() {
    if (window.speechSynthesis) speechSynthesis.cancel();
    setAvatarState('idle');
}

document.getElementById('tts-toggle').addEventListener('click', () => {
    state.ttsEnabled = !state.ttsEnabled;
    const btn  = document.getElementById('tts-toggle');
    const icon = document.getElementById('tts-icon');
    btn.classList.toggle('active', state.ttsEnabled);
    icon.setAttribute('data-lucide', state.ttsEnabled ? 'volume-2' : 'volume-x');
    renderIcons();
    if (!state.ttsEnabled) stopSpeaking();
});

/* ══════════════════════════════════════
   Voice Input (STT)
══════════════════════════════════════ */
let recognition = null;

function initRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = 'en-US';
    r.onresult = e => {
        const t = Array.from(e.results).map(x => x[0].transcript).join('');
        document.getElementById('ans-input').value = t;
        const w = t.trim().split(/\s+/).filter(Boolean).length;
        document.getElementById('word-count').textContent =
            `${w} word${w !== 1 ? 's' : ''} · Ctrl+Enter to submit`;
    };
    r.onerror = () => stopRecording();
    r.onend   = () => { if (state.isRecording) { try { r.start(); } catch(e){} } };
    return r;
}

function startRecording() {
    stopSpeaking();
    if (!recognition) recognition = initRecognition();
    if (!recognition) { alert('Voice input requires Chrome or Edge.'); return; }
    try { recognition.start(); } catch(e) {}
    state.isRecording = true;

    const btn  = document.getElementById('mic-btn');
    const icon = document.getElementById('mic-icon');
    btn.classList.add('recording');
    icon.setAttribute('data-lucide', 'mic-off');
    renderIcons();
    setAvatarState('listening');
    document.getElementById('stt-indicator')?.classList.add('active');
    document.getElementById('word-count').style.display = 'none';
}

function stopRecording() {
    if (recognition) { try { recognition.stop(); } catch(e) {} }
    state.isRecording = false;

    const btn  = document.getElementById('mic-btn');
    const icon = document.getElementById('mic-icon');
    btn.classList.remove('recording');
    icon.setAttribute('data-lucide', 'mic');
    renderIcons();
    setAvatarState('idle');
    document.getElementById('stt-indicator')?.classList.remove('active');
    document.getElementById('word-count').style.display = '';
}

document.getElementById('mic-btn').addEventListener('click', () => {
    state.isRecording ? stopRecording() : startRecording();
});

/* ══════════════════════════════════════
   IDK / Explanation
══════════════════════════════════════ */
document.getElementById('idk-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('idk-btn');
    btn.disabled = true;
    btn.textContent = 'Loading…';
    renderIcons(document.getElementById('idk-banner'));
    try {
        const data = await api('/api/hint', { sessionId: state.sessionId });
        showExplanation(data);
    } catch (err) {
        alert('Could not get explanation: ' + err.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Ask Alex';
    }
});

function showExplanation(data) {
    const panel = document.getElementById('explanation-panel');
    document.getElementById('exp-topic').textContent = data.topic || 'Explanation';
    document.getElementById('exp-text').innerHTML = renderRich(data.explanation || '');

    const pts = document.getElementById('exp-points');
    pts.innerHTML = (data.keyPoints || []).map(p =>
        `<div class="exp-point"><i data-lucide="check-circle-2"></i><span>${p}</span></div>`
    ).join('');
    renderIcons(pts);

    const exEl = document.getElementById('exp-example');
    if (data.example) {
        document.getElementById('exp-example-text').textContent = data.example;
        exEl.classList.remove('hidden');
    } else { exEl.classList.add('hidden'); }

    const hEl = document.getElementById('exp-hint-wrap');
    if (data.hint) {
        document.getElementById('exp-hint-text').textContent = data.hint;
        hEl.classList.remove('hidden');
    } else { hEl.classList.add('hidden'); }

    // Code snippet
    const codeWrap = document.getElementById('exp-code-wrap');
    if (data.codeSnippet?.snippet && codeWrap) {
        codeWrap.innerHTML = buildCodeBlock(data.codeSnippet.language || 'code', data.codeSnippet.snippet);
        attachCopyBtns(codeWrap);
        highlightBlock(codeWrap);
        codeWrap.classList.remove('hidden');
    } else if (codeWrap) { codeWrap.classList.add('hidden'); }

    // Mermaid diagram
    const diagWrap = document.getElementById('exp-diagram-wrap');
    if (data.diagram?.trim() && diagWrap) {
        diagWrap.classList.remove('hidden');
        renderMermaidBlock(diagWrap.querySelector('.exp-diagram-canvas'), data.diagram);
    } else if (diagWrap) { diagWrap.classList.add('hidden'); }

    renderIcons(panel);
    panel.classList.remove('hidden');
    animIn(panel);
    attachCopyBtns(panel);
    highlightBlock(panel);

    // Clear IDK text, hide banner
    document.getElementById('ans-input').value = '';
    document.getElementById('word-count').textContent = '0 words · Ctrl+Enter to submit';
    document.getElementById('idk-banner')?.classList.add('hidden');

    speak(`Here's an explanation. ${data.explanation || ''}`);
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('exp-close')?.addEventListener('click', () => {
    document.getElementById('explanation-panel').classList.add('hidden');
    document.getElementById('ans-input').focus();
});

document.getElementById('exp-try-btn')?.addEventListener('click', () => {
    document.getElementById('explanation-panel').classList.add('hidden');
    document.getElementById('ans-input').focus();
    speak('Take your time and give it your best shot!');
});

/* ══════════════════════════════════════
   Answer Hints + Sample Answers
══════════════════════════════════════ */
const HINT_ICON = {
    'How to Answer':         'book-open',
    'Key Concepts':          'list',
    'Common Mistake':        'alert-circle',
    'What Scores 9/10':      'check-circle-2',
    // legacy keys
    'How to Structure':      'book-open',
    'Key Points to Cover':   'list',
    'Strong Answer Includes':'check-circle-2',
    'Avoid This Mistake':    'alert-circle',
};

function updateWordCount(text) {
    const w = (text || '').trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent =
        `${w} word${w !== 1 ? 's' : ''} · Ctrl+Enter to submit`;
}

function insertHintText(text) {
    const ta  = document.getElementById('ans-input');
    const cur = ta.value.trim();
    ta.value  = cur ? `${cur}\n\n${text}` : text;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    updateWordCount(ta.value);
}

function setAnswerText(text) {
    const ta = document.getElementById('ans-input');
    ta.value = text;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
    updateWordCount(ta.value);
    document.getElementById('idk-banner')?.classList.add('hidden');
}

function renderHints(hints, sampleAnswers) {
    const area  = document.getElementById('hints-area');
    const cards = document.getElementById('hints-cards');
    const hasHints   = hints?.length > 0;
    const hasSamples = sampleAnswers?.length > 0;

    if (!hasHints && !hasSamples) { area.classList.add('hidden'); return; }

    /* ── Hint guide cards ── */
    if (hasHints) {
        const items = hints.map(h => {
            if (typeof h !== 'object' || h === null) return { title: 'Hint', detail: String(h || ''), code: null };
            let detail = h.detail;
            if (Array.isArray(detail))        detail = detail.join(' ');
            else if (typeof detail === 'object' && detail !== null) detail = JSON.stringify(detail);
            else                              detail = String(detail ?? '');
            const code = (h.code && typeof h.code === 'object') ? h.code : null;
            return { title: String(h.title || 'Hint'), detail, code };
        });

        cards.innerHTML = items.map((h, i) => {
            const iconName   = HINT_ICON[h.title] || 'lightbulb';
            const safeDetail = h.detail.replace(/"/g, '&quot;');
            const codeHtml   = h.code ? buildCodeBlock(h.code.language || 'code', h.code.snippet || '') : '';
            return `<div class="hint-card anim-in" style="animation-delay:${i * 0.07}s" tabindex="0"
                    data-detail="${safeDetail}">
                <div class="hint-card-header">
                    <span class="hint-card-icon"><i data-lucide="${iconName}"></i></span>
                    <span class="hint-card-title">${h.title}</span>
                    <span class="hint-card-tab">Tab ↵</span>
                </div>
                <div class="hint-card-detail">${renderRich(h.detail)}</div>
                ${codeHtml}
                <button class="hint-insert-btn" tabindex="-1">+ Add to answer</button>
            </div>`;
        }).join('');

        renderIcons(cards);
        attachCopyBtns(cards);
        highlightBlock(cards);

        cards.querySelectorAll('.hint-card').forEach(card => {
            const btn    = card.querySelector('.hint-insert-btn');
            const detail = card.dataset.detail;
            const doInsert = () => {
                insertHintText(detail);
                card.classList.add('used');
                btn.textContent = '✓ Added';
            };
            btn.addEventListener('click', e => { e.stopPropagation(); doInsert(); });
            card.addEventListener('click', doInsert);
            card.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doInsert(); }
            });
        });

        document.getElementById('ans-input').addEventListener('keydown', function tabNav(e) {
            if (e.key === 'Tab') {
                const first = cards.querySelector('.hint-card:not(.used)');
                if (first) { e.preventDefault(); first.focus(); }
            }
        }, { once: false });
    } else {
        cards.innerHTML = '';
    }

    /* ── Complete sample answers ── */
    const saSection = document.getElementById('sa-section');
    const saCards   = document.getElementById('sa-cards');

    if (hasSamples && saSection && saCards) {
        const levelMeta = {
            'Good':   { cls: 'sa-good',   icon: 'thumbs-up' },
            'Expert': { cls: 'sa-expert', icon: 'award' },
            'Basic':  { cls: 'sa-basic',  icon: 'book-open' },
        };

        saCards.innerHTML = sampleAnswers.map((sa, i) => {
            const meta  = levelMeta[sa.level] || { cls: 'sa-good', icon: 'check-circle-2' };
            // Safely coerce answer to string regardless of what the AI returned
            let answer = sa.answer;
            if (Array.isArray(answer))                            answer = answer.join(' ');
            else if (typeof answer === 'object' && answer !== null) answer = JSON.stringify(answer);
            else                                                  answer = String(answer ?? '');
            const score      = String(sa.score || '');
            const scoreColor = score.startsWith('9') ? 'var(--emerald)' :
                               score.startsWith('8') ? 'var(--indigo)'  : 'var(--amber)';
            const wordCount  = answer.trim().split(/\s+/).filter(Boolean).length;
            const saCodeHtml = (sa.code && typeof sa.code === 'object')
                ? buildCodeBlock(sa.code.language || 'code', sa.code.snippet || '') : '';
            return `<div class="sa-card ${meta.cls} anim-in" style="animation-delay:${i * 0.1}s"
                    data-answer="${answer.replace(/"/g, '&quot;')}">
                <div class="sa-card-hdr">
                    <div class="sa-level-badge ${meta.cls}">
                        <i data-lucide="${meta.icon}"></i>
                        <span>${sa.level || 'Answer'}</span>
                    </div>
                    <span class="sa-score-tag" style="color:${scoreColor}">${score}</span>
                    <span class="sa-words">${wordCount} words</span>
                    <span class="sa-use-hint">Click to use</span>
                </div>
                <p class="sa-answer-text">${answer}</p>
                ${saCodeHtml}
                <button class="sa-use-btn ${meta.cls}">
                    <i data-lucide="clipboard-copy"></i>
                    Use this answer
                </button>
            </div>`;
        }).join('');

        renderIcons(saCards);
        attachCopyBtns(saCards);
        highlightBlock(saCards);

        saCards.querySelectorAll('.sa-card').forEach(card => {
            const answer = card.dataset.answer;
            const useBtn = card.querySelector('.sa-use-btn');

            const doUse = () => {
                setAnswerText(answer);
                // Visual: mark this card selected, deselect others
                saCards.querySelectorAll('.sa-card').forEach(c => {
                    c.classList.remove('sa-selected');
                    const b = c.querySelector('.sa-use-btn');
                    if (b) {
                        b.innerHTML = `<i data-lucide="clipboard-copy"></i> Use this answer`;
                        renderIcons(b);
                    }
                });
                card.classList.add('sa-selected');
                useBtn.innerHTML = `<i data-lucide="check-circle-2"></i> Selected`;
                renderIcons(useBtn);
            };

            useBtn.addEventListener('click', e => { e.stopPropagation(); doUse(); });
            card.addEventListener('click', doUse);
        });

        saSection.classList.remove('hidden');
        renderIcons(saSection);
    } else if (saSection) {
        saSection.classList.add('hidden');
    }

    area.classList.remove('hidden');
}

/* ══════════════════════════════════════
   Suggestions (post-answer chips)
══════════════════════════════════════ */
function renderSuggestions(suggestions) {
    const area  = document.getElementById('suggestions-area');
    const chips = document.getElementById('suggestions-chips');
    if (!suggestions?.length) { area.classList.add('hidden'); return; }

    chips.innerHTML = suggestions.map(s =>
        `<span class="sug-chip">${s}</span>`
    ).join('');
    area.classList.remove('hidden');
    animStagger('.sug-chip', chips);
}

/* ══════════════════════════════════════
   WELCOME
══════════════════════════════════════ */
window.addEventListener('DOMContentLoaded', () => {
    renderIcons();
    initResumeUpload();
    animIn(document.getElementById('wl-wrap'));
});

document.getElementById('setup-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name   = document.getElementById('input-name').value.trim();
    const mobile = document.getElementById('input-mobile').value.trim();
    const email  = document.getElementById('input-email').value.trim();
    const role   = document.getElementById('input-role').value.trim();
    const type   = document.querySelector('input[name="itype"]:checked')?.value;
    if (!name || !mobile || !email || !role || !type) return;

    state.interviewType = type;
    const btn = document.getElementById('start-btn');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Starting…';

    showScreen('screen-interview');
    setLoading(true, 'Connecting you with Alex…');

    document.getElementById('sb-name').textContent = name;
    document.getElementById('sb-role').textContent = role;
    document.getElementById('sb-type').textContent = type.replace(/-/g, ' ');

    try {
        const data = await api('/api/start', { name, mobile, email, role, type, resumeText: resumeText || undefined });
        state.sessionId = data.sessionId;
        setModel(data.model);
        renderQuestion(data);
    } catch (err) {
        alert('Error: ' + err.message);
        showScreen('screen-welcome');
    } finally {
        setLoading(false);
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Start Interview';
    }
});

/* ══════════════════════════════════════
   Question
══════════════════════════════════════ */
function renderQuestion(data) {
    stopRecording();
    state.qNum = data.number || (state.qNum + 1);
    const total = data.total || TOTAL_QUESTIONS;

    // Track skill areas
    if (data.skillArea) {
        state.skills[data.skillArea] = (state.skills[data.skillArea] || 0) + 1;
        updateSkillBar();
    }

    document.getElementById('hd-qnum-label').textContent = `Question ${state.qNum} of ${total}`;
    document.getElementById('hd-progress-fill').style.width = `${(state.qNum / total) * 100}%`;

    document.getElementById('q-topic').textContent = data.topic || '';
    const diffEl = document.getElementById('q-diff');
    diffEl.textContent = data.difficulty
        ? data.difficulty.charAt(0).toUpperCase() + data.difficulty.slice(1) : '';
    diffEl.className = `chip ${diffChip(data.difficulty)}`;
    document.getElementById('q-text').textContent = data.question || '';

    document.getElementById('fb-card').classList.add('hidden');
    document.getElementById('suggestions-area').classList.add('hidden');
    document.getElementById('hints-area').classList.add('hidden');
    document.getElementById('ans-area').classList.remove('hidden');
    document.getElementById('next-area').classList.add('hidden');
    document.getElementById('ans-input').value = '';
    document.getElementById('word-count').textContent = '0 words · Ctrl+Enter to submit';
    document.getElementById('word-count').style.display = '';
    document.getElementById('stt-indicator')?.classList.remove('active');
    document.getElementById('explanation-panel')?.classList.add('hidden');
    document.getElementById('idk-banner')?.classList.add('hidden');
    document.getElementById('sa-section')?.classList.add('hidden');
    resetAnswerHindi();
    state.pendingNext = state.pendingReport = null;

    document.querySelector('.iv-main').scrollTo(0, 0);
    animIn(document.getElementById('q-card'));

    renderHints(data.hints, data.sampleAnswers);

    setAvatarState('thinking');
    setTimeout(() => speak(data.question, () => {
        document.getElementById('ans-input').focus();
    }), 300);
}

/* ══════════════════════════════════════
   Answer
══════════════════════════════════════ */
const IDK_RE = /^(i\s*don'?t\s*know|i\s*have\s*no\s*idea|not\s*sure|idk|no\s*idea|i'?m\s*not\s*sure|no\s*clue|pass|skip|i\s*don'?t\s*have\s*a\s*clue)[\s.!?]*$/i;

document.getElementById('ans-input').addEventListener('input', e => {
    const val = e.target.value;
    const w = val.trim().split(/\s+/).filter(Boolean).length;
    document.getElementById('word-count').textContent =
        `${w} word${w !== 1 ? 's' : ''} · Ctrl+Enter to submit`;
    // IDK detection - only for short clearly-IDK phrases
    const banner = document.getElementById('idk-banner');
    if (banner) banner.classList.toggle('hidden', !IDK_RE.test(val.trim()));
});
document.getElementById('ans-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); submitAnswer(); }
});
document.getElementById('submit-btn').addEventListener('click', submitAnswer);

async function submitAnswer() {
    const answer = document.getElementById('ans-input').value.trim();
    if (!answer) return;

    stopRecording(); stopSpeaking();
    resetAnswerHindi();
    setAvatarState('thinking');
    setLoading(true, 'Alex is reviewing your answer…');
    document.getElementById('ans-area').classList.add('hidden');
    document.getElementById('hints-area').classList.add('hidden');
    document.getElementById('explanation-panel')?.classList.add('hidden');
    document.getElementById('idk-banner')?.classList.add('hidden');

    try {
        const data = await api('/api/answer', { sessionId: state.sessionId, answer });
        setLoading(false);
        setModel(data.model);
        renderFeedback(data.feedback);

        if (data.report) {
            state.pendingReport = data.report;
            const btn = document.getElementById('next-btn');
            btn.querySelector('span').textContent = 'View Final Report';
            btn.onclick = () => renderReport(state.pendingReport);
        } else if (data.next) {
            state.pendingNext = data.next;
            const btn = document.getElementById('next-btn');
            btn.querySelector('span').textContent = 'Next Question';
            btn.onclick = () => renderQuestion(state.pendingNext);
        }
        document.getElementById('next-area').classList.remove('hidden');
        animIn(document.getElementById('next-area'));
    } catch (err) {
        setLoading(false); setAvatarState('idle');
        alert('Error: ' + err.message);
        document.getElementById('ans-area').classList.remove('hidden');
        document.getElementById('hints-area').classList.remove('hidden');
    }
}

/* ══════════════════════════════════════
   Feedback - comprehensive display
══════════════════════════════════════ */
function renderFeedback(fb) {
    const score = fb.score ?? 0;
    const color = scoreColor(score);
    const label = fb.label || scoreLabel(score);

    const circle = document.getElementById('fb-score-circle');
    const numEl  = document.getElementById('fb-score-num');
    numEl.textContent = score;
    numEl.style.color = color;
    circle.style.borderColor = color;
    circle.style.background  = color + '18';

    document.getElementById('fb-label').textContent = label;
    document.getElementById('fb-label').style.color = color;
    document.getElementById('fb-feedback').textContent = fb.feedback || '';

    document.getElementById('fb-strengths').innerHTML =
        (fb.strengths || []).map(s => `<li>${s}</li>`).join('');
    document.getElementById('fb-improvements').innerHTML =
        (fb.improvements || []).map(s => `<li>${s}</li>`).join('');

    const ideal = document.getElementById('fb-ideal');
    if (fb.idealAnswer) {
        document.getElementById('fb-ideal-text').textContent = fb.idealAnswer;
        ideal.classList.remove('hidden');
    } else { ideal.classList.add('hidden'); }

    document.getElementById('fb-card').classList.remove('hidden');
    renderIcons();
    animIn(document.getElementById('fb-card'));

    renderSuggestions(fb.suggestions);

    const topic = document.getElementById('q-topic').textContent || `Q${state.qNum}`;
    state.scores.push({ q: state.qNum, topic, score });
    updateSidebar(); updateAvg();

    document.getElementById('fb-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    speak(`Score: ${score} out of 10. ${label}. ${fb.feedback || ''}`);
}

function updateSidebar() {
    const el = document.getElementById('sb-scores');
    if (!state.scores.length) { el.innerHTML = '<p class="sb-empty">No answers yet</p>'; return; }
    el.innerHTML = state.scores.map(s =>
        `<div class="sb-score-row">
            <span class="sb-score-q">Q${s.q}: ${s.topic}</span>
            <span class="pill ${scorePill(s.score)}">${s.score}/10</span>
        </div>`
    ).join('');
}

function updateAvg() {
    if (!state.scores.length) return;
    const avg = state.scores.reduce((a, b) => a + b.score, 0) / state.scores.length;
    const el = document.getElementById('hd-avg');
    el.textContent = `Avg ${avg.toFixed(1)}`;
    el.style.color = scoreColor(avg);
}

/* ══════════════════════════════════════
   Report
══════════════════════════════════════ */
function renderReport(report) {
    stopSpeaking();
    showScreen('screen-report');

    const score = report.overallScore ?? 0;
    const name  = document.getElementById('sb-name').textContent;
    const role  = document.getElementById('sb-role').textContent;

    document.getElementById('rpt-candidate').textContent = `${name} · ${role}`;
    document.getElementById('rpt-score').textContent = score.toFixed(1);
    document.getElementById('rpt-score').style.color = scoreColor(score);

    const ring = document.getElementById('ring-fill');
    ring.style.stroke = scoreColor(score);
    requestAnimationFrame(() => requestAnimationFrame(() => {
        ring.style.strokeDashoffset = 352 - (score / 10) * 352;
    }));

    document.getElementById('rpt-grade').textContent = report.grade || '-';
    document.getElementById('rpt-grade').className   = 'vbadge vbadge-grade';

    const recEl = document.getElementById('rpt-rec');
    recEl.textContent = report.recommendation || '-';
    const recMap = {
        'Strong Hire': 'vbadge-rec-sh', 'Hire': 'vbadge-rec-h',
        'Consider': 'vbadge-rec-c',     'No Hire': 'vbadge-rec-n'
    };
    recEl.className = `vbadge ${recMap[report.recommendation] || 'vbadge-rec-h'}`;

    document.getElementById('rpt-summary').textContent = report.summary || '';
    document.getElementById('rpt-strengths').innerHTML =
        (report.topStrengths || []).map(s => `<li>${s}</li>`).join('');
    document.getElementById('rpt-improvements').innerHTML =
        (report.topImprovements || []).map(s => `<li>${s}</li>`).join('');

    const breakdown = report.questionBreakdown ||
        state.scores.map(s => ({ number: s.q, topic: s.topic, score: s.score }));
    document.getElementById('rpt-breakdown').innerHTML = breakdown.map(b =>
        `<div class="bd-row">
            <span class="bd-num">Q${b.number}</span>
            <span class="bd-topic">${b.topic || ''}</span>
            <span class="bd-score" style="color:${scoreColor(b.score)}">${b.score}/10</span>
            <span class="pill ${scorePill(b.score)}">${scoreLabel(b.score)}</span>
        </div>`
    ).join('');

    document.getElementById('rpt-nextsteps').textContent = report.nextSteps || '';

    animIn(document.getElementById('rpt-wrap'));
    setTimeout(() => animStagger('.rpt-card', document.getElementById('rpt-wrap')), 300);

    setTimeout(() => speak(
        `Interview complete. Overall score: ${score.toFixed(1)} out of 10. Grade: ${report.grade}. ${report.recommendation}. ${report.summary}`
    ), 800);
}

document.getElementById('restart-btn').addEventListener('click', () => {
    stopSpeaking(); stopRecording();
    resumeText = null;
    Object.assign(state, {
        sessionId: null, scores: [], skills: {}, qNum: 0,
        pendingNext: null, pendingReport: null, interviewType: 'all'
    });
    document.getElementById('sb-scores').innerHTML = '<p class="sb-empty">No answers yet</p>';
    document.getElementById('hd-avg').textContent = '-';
    document.getElementById('ring-fill').style.strokeDashoffset = 352;
    document.getElementById('skills-card').classList.add('hidden');
    const mb = document.getElementById('model-badge');
    if (mb) { mb.textContent = ''; mb.classList.add('hidden'); }
    _lastModel = '';
    showScreen('screen-welcome');
    animIn(document.getElementById('wl-wrap'));
});
