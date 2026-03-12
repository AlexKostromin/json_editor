import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import {
  base64Encode, base64Decode, urlEncode, urlDecode,
  timestampToDate, dateToTimestamp, generateUUIDs, decodeJwt,
  jsonToYaml, yamlToJson, generateJsonSchema, generateHashes,
  testRegex, convertColor, jsonDiff, generateMockUsers,
  parseCron, generatePasswords, generateLoremIpsum, convertNumberBase,
  convertCase, htmlEntityEncode, htmlEntityDecode, escapeString, unescapeString,
  queryStringToJson, jsonToQueryString,
} from './tools';
import './style.css';

const app = document.getElementById('app')!;

// SVG Icons
const icons = {
  format: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>',
  compact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
  clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  paste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
  sample: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>',
  jwt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
};

// ========== Header ==========
const header = document.createElement('header');
header.innerHTML = `
  <div class="header-left">
    <div class="logo-icon">&lt;/&gt;</div>
    <h1>Dev<span>Tools</span></h1>
    <div class="header-badge">Online</div>
  </div>
  <div class="header-right-section">
    <label class="theme-btn" title="Toggle theme">
      <input type="checkbox" id="theme-switch" />
      <span id="theme-icon">☀️</span>
    </label>
  </div>
`;
app.appendChild(header);

// ========== Tools Bar ==========
const toolsBar = document.createElement('div');
toolsBar.className = 'tools-bar';
toolsBar.innerHTML = `
  <button class="tool-chip json active" id="btn-json">{ }<span>JSON</span></button>
  <div class="tools-sep"></div>
  <button class="tool-chip jwt" id="btn-jwt-header">${icons.jwt}<span>JWT</span></button>
  <button class="tool-chip base64" id="btn-base64">B64<span>Base64</span></button>
  <button class="tool-chip url" id="btn-url">%<span>URL</span></button>
  <button class="tool-chip timestamp" id="btn-timestamp">⏱<span>Timestamp</span></button>
  <button class="tool-chip uuid" id="btn-uuid">ID<span>UUID</span></button>
  <div class="tools-sep"></div>
  <button class="tool-chip yaml" id="btn-yaml">YML<span>YAML</span></button>
  <button class="tool-chip schema" id="btn-schema">{ }<span>Schema</span></button>
  <button class="tool-chip hash" id="btn-hash">#<span>Hash</span></button>
  <button class="tool-chip regex" id="btn-regex">.*<span>Regex</span></button>
  <button class="tool-chip color" id="btn-color">●<span>Color</span></button>
  <button class="tool-chip diff" id="btn-diff">≠<span>Diff</span></button>
  <button class="tool-chip mock" id="btn-mock">⊞<span>Mock</span></button>
  <div class="tools-sep"></div>
  <button class="tool-chip cron" id="btn-cron">⏲<span>Cron</span></button>
  <button class="tool-chip password" id="btn-password">🔑<span>Password</span></button>
  <button class="tool-chip lorem" id="btn-lorem">Aa<span>Lorem</span></button>
  <button class="tool-chip numbase" id="btn-numbase">0x<span>Base</span></button>
  <button class="tool-chip casecvt" id="btn-casecvt">Aa<span>Case</span></button>
  <button class="tool-chip htmlent" id="btn-htmlent">&amp;<span>Entity</span></button>
  <button class="tool-chip strescape" id="btn-strescape">\\n<span>Escape</span></button>
  <button class="tool-chip querystr" id="btn-querystr">?=<span>Query</span></button>
`;
app.appendChild(toolsBar);

// ========== Toolbar ==========
const toolbar = document.createElement('div');
toolbar.className = 'toolbar';
toolbar.innerHTML = `
  <div class="btn-group">
    <button class="btn btn-primary" id="btn-format" data-tooltip="Format JSON">
      ${icons.format}<span class="btn-label">Format</span>
    </button>
    <button class="btn" id="btn-compact" data-tooltip="Minify to one line">
      ${icons.compact}<span class="btn-label">Minify</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-copy" data-tooltip="Copy">
      ${icons.copy}<span class="btn-label">Copy</span>
    </button>
    <button class="btn" id="btn-paste" data-tooltip="Paste from clipboard">
      ${icons.paste}<span class="btn-label">Paste</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-upload" data-tooltip="Upload file">
      ${icons.upload}<span class="btn-label">Open</span>
    </button>
    <button class="btn" id="btn-download" data-tooltip="Download JSON">
      ${icons.download}<span class="btn-label">Save</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-sample" data-tooltip="Load sample">
      ${icons.sample}<span class="btn-label">Sample</span>
    </button>
    <button class="btn btn-danger" id="btn-clear" data-tooltip="Clear editor">
      ${icons.clear}<span class="btn-label">Clear</span>
    </button>
  </div>
`;
app.appendChild(toolbar);

// Hidden file input
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.json,.yaml,.yml,application/json';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

// ========== Universal Modal ==========
const modal = document.createElement('div');
modal.className = 'modal-overlay';
modal.innerHTML = `
  <div class="modal">
    <h2 id="modal-title"></h2>
    <div id="modal-body"></div>
    <div class="modal-buttons">
      <button class="btn" id="modal-cancel">Cancel</button>
      <button class="btn btn-primary" id="modal-action"></button>
    </div>
  </div>
`;
document.body.appendChild(modal);

const modalTitle = document.getElementById('modal-title')!;
const modalBody = document.getElementById('modal-body')!;
const modalAction = document.getElementById('modal-action')!;

let currentModalHandler: (() => void) | null = null;

function openModal(title: string, bodyHtml: string, actionLabel: string, handler: () => void) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalAction.textContent = actionLabel;
  currentModalHandler = handler;
  modal.classList.add('show');
  const firstInput = modalBody.querySelector('textarea, input') as HTMLElement | null;
  if (firstInput) setTimeout(() => firstInput.focus(), 50);
}

function closeModal() {
  modal.classList.remove('show');
  currentModalHandler = null;
}

document.getElementById('modal-cancel')!.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
modalAction.addEventListener('click', () => { if (currentModalHandler) currentModalHandler(); });

// Toast
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);

let toastTimer: ReturnType<typeof setTimeout>;
function showToast(message: string) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

// ========== Editor ==========
const editorWrapper = document.createElement('div');
editorWrapper.className = 'editor-wrapper';
app.appendChild(editorWrapper);

// ========== Footer ==========
const footer = document.createElement('footer');
footer.className = 'app-footer';
footer.innerHTML = `
  <span>DevTools Online</span>
  <span class="footer-sep">·</span>
  <span>20 tools</span>
  <span class="footer-sep">·</span>
  <span>Everything runs in your browser</span>
  <span class="footer-sep">·</span>
  <span class="visit-counter">Visits: <strong id="visit-count">...</strong></span>
`;
app.appendChild(footer);

// Global visit counter via counterapi.dev — increment once, then poll for updates
const visitCountEl = document.getElementById('visit-count')!;
fetch('https://api.counterapi.dev/v1/devtools-online/visits/up')
  .then(r => r.json())
  .then(data => { visitCountEl.textContent = String(data.count); })
  .catch(() => { visitCountEl.textContent = '—'; });
setInterval(() => {
  fetch('https://api.counterapi.dev/v1/devtools-online/visits/')
    .then(r => r.json())
    .then(data => { visitCountEl.textContent = String(data.count); })
    .catch(() => {});
}, 10000);

// ========== Sample data ==========
const sampleJson = {
  name: 'DevTools Online',
  description: 'Online developer tools',
  version: '2.0.0',
  features: ['tree view', 'text mode', 'table mode', 'search', 'formatting'],
  author: { name: 'User', email: 'user@example.com' },
  tags: ['json', 'editor', 'tool'],
  settings: { theme: 'dark', fontSize: 14, autoFormat: true },
};

let content: { json: unknown } | { text: string } = { json: sampleJson };

const editorProps: JSONEditorPropsOptional = {
  content,
  navigationBar: false,
  onRenderContextMenu: () => false,
  onChange: (updatedContent) => { content = updatedContent as typeof content; },
};

const editor = createJSONEditor({ target: editorWrapper, props: editorProps });
editor.updateProps({ navigationBar: false });

function getTextContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json);
}

function getFormattedContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json, null, 2);
}

// ========== JSON Button (return to editor) ==========
document.getElementById('btn-json')!.addEventListener('click', () => {
  editor.set({ json: sampleJson });
  showToast('JSON Editor');
});

// ========== JSON Button Handlers ==========

document.getElementById('btn-format')!.addEventListener('click', () => {
  try { editor.set({ json: JSON.parse(getTextContent()) }); showToast('JSON formatted'); }
  catch { showToast('Error: invalid JSON'); }
});

document.getElementById('btn-compact')!.addEventListener('click', () => {
  try { editor.set({ text: JSON.stringify(JSON.parse(getTextContent())) }); showToast('JSON minified'); }
  catch { showToast('Error: invalid JSON'); }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  editor.set({ text: '' }); showToast('Cleared');
});

document.getElementById('btn-copy')!.addEventListener('click', () => {
  navigator.clipboard.writeText(getFormattedContent()).then(() => showToast('Copied'));
});

document.getElementById('btn-paste')!.addEventListener('click', () => {
  navigator.clipboard.readText().then((text) => {
    try { editor.set({ json: JSON.parse(text) }); showToast('JSON pasted'); }
    catch { editor.set({ text }); showToast('Text pasted'); }
  }).catch(() => showToast('No clipboard access'));
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson }); showToast('Sample loaded');
});

document.getElementById('btn-upload')!.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    try { editor.set({ json: JSON.parse(text) }); showToast(`${file.name} loaded`); }
    catch { editor.set({ text }); showToast('File loaded'); }
  };
  reader.readAsText(file);
  fileInput.value = '';
});

document.getElementById('btn-download')!.addEventListener('click', () => {
  const blob = new Blob([getFormattedContent()], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'data.json'; a.click();
  URL.revokeObjectURL(url);
  showToast('File downloaded');
});

// ========== Tool Handlers ==========

// JWT
document.getElementById('btn-jwt-header')!.addEventListener('click', () => {
  openModal('JWT Decoder', '<textarea id="tool-input" placeholder="Paste JWT token (eyJhbG...)..." rows="4"></textarea>', 'Decode', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast('Paste a JWT token'); return; }
    try { editor.set({ json: decodeJwt(v) }); closeModal(); showToast('JWT decoded'); }
    catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Base64
document.getElementById('btn-base64')!.addEventListener('click', () => {
  openModal('Base64 Encode / Decode',
    `<textarea id="tool-input" placeholder="Enter text or Base64 string..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="b64dir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="b64dir" value="decode" /> Decode</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Enter text'); return; }
    const dir = (document.querySelector('input[name="b64dir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? base64Encode(v) : base64Decode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(`Base64 ${dir === 'encode' ? 'encoded' : 'decoded'}`);
    } catch { showToast('Error: invalid data'); }
  });
});

// URL
document.getElementById('btn-url')!.addEventListener('click', () => {
  openModal('URL Encode / Decode',
    `<textarea id="tool-input" placeholder="Enter URL or text..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="urldir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="urldir" value="decode" /> Decode</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Enter text'); return; }
    const dir = (document.querySelector('input[name="urldir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? urlEncode(v) : urlDecode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(`URL ${dir === 'encode' ? 'encoded' : 'decoded'}`);
    } catch { showToast('Error'); }
  });
});

// Timestamp
document.getElementById('btn-timestamp')!.addEventListener('click', () => {
  openModal('Unix Timestamp Converter',
    '<textarea id="tool-input" placeholder="Unix timestamp (1710000000)... Empty = current time" rows="2"></textarea>',
    'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    try {
      editor.set({ json: JSON.parse(v ? timestampToDate(v) : dateToTimestamp()) });
      closeModal(); showToast(v ? 'Timestamp converted' : 'Current time');
    } catch { showToast('Invalid timestamp'); }
  });
});

// UUID
document.getElementById('btn-uuid')!.addEventListener('click', () => {
  const uuids = generateUUIDs(5);
  editor.set({ json: { generated: uuids, count: uuids.length, version: 'v4 (random)' } });
  showToast('5 UUIDs generated');
});

// YAML
document.getElementById('btn-yaml')!.addEventListener('click', () => {
  openModal('YAML ↔ JSON Converter',
    `<textarea id="tool-input" placeholder="Paste JSON or YAML..." rows="6"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="yamldir" value="json-to-yaml" checked /> JSON → YAML</label>
       <label><input type="radio" name="yamldir" value="yaml-to-json" /> YAML → JSON</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v.trim()) { showToast('Paste data'); return; }
    const dir = (document.querySelector('input[name="yamldir"]:checked') as HTMLInputElement).value;
    try {
      if (dir === 'json-to-yaml') {
        const yamlStr = jsonToYaml(v);
        editor.set({ text: yamlStr });
        closeModal(); showToast('Converted to YAML');
      } else {
        const jsonStr = yamlToJson(v);
        editor.set({ json: JSON.parse(jsonStr) });
        closeModal(); showToast('Converted to JSON');
      }
    } catch { showToast('Conversion error'); }
  });
});

// JSON Schema
document.getElementById('btn-schema')!.addEventListener('click', () => {
  try {
    const schema = generateJsonSchema(getTextContent());
    editor.set({ json: schema });
    showToast('JSON Schema generated');
  } catch { showToast('Error: invalid JSON'); }
});

// Hash
document.getElementById('btn-hash')!.addEventListener('click', () => {
  openModal('Hash Generator',
    '<textarea id="tool-input" placeholder="Enter text to hash..." rows="4"></textarea>',
    'Generate', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Enter text'); return; }
    generateHashes(v).then((hashes) => {
      editor.set({ json: hashes });
      closeModal(); showToast('Hashes generated');
    });
  });
});

// Regex
document.getElementById('btn-regex')!.addEventListener('click', () => {
  openModal('Regex Tester',
    `<div class="modal-field-group">
       <input id="regex-pattern" type="text" placeholder="Regular expression (e.g.: \\d+)" />
       <input id="regex-flags" type="text" placeholder="Flags (g, i, m...)" value="g" style="width:80px" />
     </div>
     <textarea id="tool-input" placeholder="Text to test..." rows="4"></textarea>`,
    'Test', () => {
    const pattern = (document.getElementById('regex-pattern') as HTMLInputElement).value;
    const flags = (document.getElementById('regex-flags') as HTMLInputElement).value;
    const text = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!pattern) { showToast('Enter regex'); return; }
    try {
      editor.set({ json: testRegex(pattern, flags, text) });
      closeModal(); showToast('Regex tested');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Invalid regex'); }
  });
});

// Color
document.getElementById('btn-color')!.addEventListener('click', () => {
  openModal('Color Converter',
    '<input id="tool-input" type="text" placeholder="HEX (#ff0000), RGB (rgb(255,0,0)) or HSL (hsl(0,100%,50%))" />',
    'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value;
    if (!v) { showToast('Enter a color'); return; }
    try {
      const result = convertColor(v);
      editor.set({ json: result });
      closeModal(); showToast('Color converted');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// JSON Diff
document.getElementById('btn-diff')!.addEventListener('click', () => {
  openModal('JSON Diff — Compare Two JSON Objects',
    `<textarea id="diff-input-1" placeholder="First JSON..." rows="4"></textarea>
     <textarea id="diff-input-2" placeholder="Second JSON..." rows="4" style="margin-top:8px"></textarea>`,
    'Compare', () => {
    const v1 = (document.getElementById('diff-input-1') as HTMLTextAreaElement).value;
    const v2 = (document.getElementById('diff-input-2') as HTMLTextAreaElement).value;
    if (!v1 || !v2) { showToast('Fill in both fields'); return; }
    try {
      editor.set({ json: jsonDiff(v1, v2) });
      closeModal(); showToast('Comparison complete');
    } catch { showToast('Error: invalid JSON'); }
  });
});

// Mock Data
document.getElementById('btn-mock')!.addEventListener('click', () => {
  openModal('Mock Data Generator',
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">Number of records:</label>
       <input id="tool-input" type="number" value="10" min="1" max="100" style="width:80px" />
     </div>`,
    'Generate', () => {
    const count = Math.min(100, Math.max(1, Number((document.getElementById('tool-input') as HTMLInputElement).value) || 10));
    const data = generateMockUsers(count);
    editor.set({ json: data });
    closeModal(); showToast(`${count} records generated`);
  });
});

// Cron Parser
document.getElementById('btn-cron')!.addEventListener('click', () => {
  openModal('Cron Expression Parser',
    '<input id="tool-input" type="text" placeholder="Cron expression (e.g. */5 * * * *)" />',
    'Parse', () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast('Enter cron expression'); return; }
    try {
      editor.set({ json: parseCron(v) });
      closeModal(); showToast('Cron parsed');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Password Generator
document.getElementById('btn-password')!.addEventListener('click', () => {
  openModal('Password Generator',
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">Length:</label>
       <input id="pw-length" type="number" value="16" min="4" max="128" style="width:80px" />
       <label style="color:#94a3b8;font-size:13px">Count:</label>
       <input id="pw-count" type="number" value="5" min="1" max="20" style="width:80px" />
     </div>
     <div class="modal-radio-group" style="flex-wrap:wrap">
       <label><input type="checkbox" name="pw-upper" checked /> A-Z</label>
       <label><input type="checkbox" name="pw-lower" checked /> a-z</label>
       <label><input type="checkbox" name="pw-nums" checked /> 0-9</label>
       <label><input type="checkbox" name="pw-syms" checked /> !@#$</label>
     </div>`,
    'Generate', () => {
    const length = Math.min(128, Math.max(4, Number((document.getElementById('pw-length') as HTMLInputElement).value) || 16));
    const count = Math.min(20, Math.max(1, Number((document.getElementById('pw-count') as HTMLInputElement).value) || 5));
    const uppercase = (document.querySelector('input[name="pw-upper"]') as HTMLInputElement).checked;
    const lowercase = (document.querySelector('input[name="pw-lower"]') as HTMLInputElement).checked;
    const numbers = (document.querySelector('input[name="pw-nums"]') as HTMLInputElement).checked;
    const symbols = (document.querySelector('input[name="pw-syms"]') as HTMLInputElement).checked;
    try {
      editor.set({ json: generatePasswords(length, count, { uppercase, lowercase, numbers, symbols }) });
      closeModal(); showToast('Passwords generated');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Lorem Ipsum Generator
document.getElementById('btn-lorem')!.addEventListener('click', () => {
  openModal('Lorem Ipsum Generator',
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">Count:</label>
       <input id="tool-input" type="number" value="5" min="1" max="100" style="width:80px" />
     </div>
     <div class="modal-radio-group">
       <label><input type="radio" name="loremmode" value="paragraphs" checked /> Paragraphs</label>
       <label><input type="radio" name="loremmode" value="sentences" /> Sentences</label>
       <label><input type="radio" name="loremmode" value="words" /> Words</label>
     </div>`,
    'Generate', () => {
    const count = Math.min(100, Math.max(1, Number((document.getElementById('tool-input') as HTMLInputElement).value) || 5));
    const mode = (document.querySelector('input[name="loremmode"]:checked') as HTMLInputElement).value as 'words' | 'sentences' | 'paragraphs';
    const result = generateLoremIpsum(mode, count);
    editor.set({ json: result });
    closeModal(); showToast('Lorem Ipsum generated');
  });
});

// Number Base Converter
document.getElementById('btn-numbase')!.addEventListener('click', () => {
  openModal('Number Base Converter',
    `<input id="tool-input" type="text" placeholder="Enter number (e.g. 255, 0xFF, 0b1010)" />
     <div class="modal-radio-group">
       <label><input type="radio" name="numbase" value="10" checked /> Decimal</label>
       <label><input type="radio" name="numbase" value="16" /> Hex</label>
       <label><input type="radio" name="numbase" value="2" /> Binary</label>
       <label><input type="radio" name="numbase" value="8" /> Octal</label>
     </div>`,
    'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast('Enter a number'); return; }
    const base = parseInt((document.querySelector('input[name="numbase"]:checked') as HTMLInputElement).value);
    try {
      editor.set({ json: convertNumberBase(v, base) });
      closeModal(); showToast('Number converted');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Case Converter
document.getElementById('btn-casecvt')!.addEventListener('click', () => {
  openModal('Case Converter',
    '<input id="tool-input" type="text" placeholder="Enter text (e.g. hello world, helloWorld, hello_world)" />',
    'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast('Enter text'); return; }
    editor.set({ json: convertCase(v) });
    closeModal(); showToast('Case converted');
  });
});

// HTML Entity Encode/Decode
document.getElementById('btn-htmlent')!.addEventListener('click', () => {
  openModal('HTML Entity Encode / Decode',
    `<textarea id="tool-input" placeholder="Enter text or HTML entities..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="htmldir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="htmldir" value="decode" /> Decode</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Enter text'); return; }
    const dir = (document.querySelector('input[name="htmldir"]:checked') as HTMLInputElement).value;
    const result = dir === 'encode' ? htmlEntityEncode(v) : htmlEntityDecode(v);
    editor.set({ json: { input: v, direction: dir, result } });
    closeModal(); showToast(`HTML entities ${dir === 'encode' ? 'encoded' : 'decoded'}`);
  });
});

// String Escape/Unescape
document.getElementById('btn-strescape')!.addEventListener('click', () => {
  openModal('String Escape / Unescape',
    `<textarea id="tool-input" placeholder="Enter string to escape or unescape..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="escdir" value="escape" checked /> Escape</label>
       <label><input type="radio" name="escdir" value="unescape" /> Unescape</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Enter text'); return; }
    const dir = (document.querySelector('input[name="escdir"]:checked') as HTMLInputElement).value;
    const result = dir === 'escape' ? escapeString(v) : unescapeString(v);
    editor.set({ json: result });
    closeModal(); showToast(`String ${dir === 'escape' ? 'escaped' : 'unescaped'}`);
  });
});

// Query String ↔ JSON
document.getElementById('btn-querystr')!.addEventListener('click', () => {
  openModal('Query String ↔ JSON',
    `<textarea id="tool-input" placeholder="Query string (?foo=1&bar=2) or JSON ({&quot;foo&quot;:&quot;1&quot;})" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="qsdir" value="qs-to-json" checked /> Query → JSON</label>
       <label><input type="radio" name="qsdir" value="json-to-qs" /> JSON → Query</label>
     </div>`, 'Convert', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast('Enter data'); return; }
    const dir = (document.querySelector('input[name="qsdir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'qs-to-json' ? queryStringToJson(v) : jsonToQueryString(v);
      editor.set({ json: result });
      closeModal(); showToast('Converted');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// ========== Theme ==========
const themeSwitch = document.getElementById('theme-switch') as HTMLInputElement;
const themeIcon = document.getElementById('theme-icon')!;

function applyTheme(dark: boolean) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
  if (!dark) document.documentElement.removeAttribute('data-theme');
  themeIcon.textContent = dark ? '🌙' : '☀️';
}

const savedTheme = localStorage.getItem('devtools-theme');
const isDark = savedTheme !== 'light';
themeSwitch.checked = isDark;
applyTheme(isDark);

themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked);
  localStorage.setItem('devtools-theme', themeSwitch.checked ? 'dark' : 'light');
});

// ========== PWA Service Worker ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/json_editor/sw.js').catch(() => {});
  });
}