import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import {
  base64Encode, base64Decode, urlEncode, urlDecode,
  timestampToDate, dateToTimestamp, generateUUIDs, decodeJwt,
  jsonToYaml, yamlToJson, generateJsonSchema, generateHashes,
  testRegex, convertColor, jsonDiff, generateMockUsers,
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
    <label class="theme-btn" title="Переключить тему">
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
`;
app.appendChild(toolsBar);

// ========== Toolbar ==========
const toolbar = document.createElement('div');
toolbar.className = 'toolbar';
toolbar.innerHTML = `
  <div class="btn-group">
    <button class="btn btn-primary" id="btn-format" data-tooltip="Форматировать JSON">
      ${icons.format}<span class="btn-label">Форматировать</span>
    </button>
    <button class="btn" id="btn-compact" data-tooltip="Сжать в одну строку">
      ${icons.compact}<span class="btn-label">Сжать</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-copy" data-tooltip="Копировать">
      ${icons.copy}<span class="btn-label">Копировать</span>
    </button>
    <button class="btn" id="btn-paste" data-tooltip="Вставить из буфера">
      ${icons.paste}<span class="btn-label">Вставить</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-upload" data-tooltip="Загрузить файл">
      ${icons.upload}<span class="btn-label">Открыть</span>
    </button>
    <button class="btn" id="btn-download" data-tooltip="Скачать JSON">
      ${icons.download}<span class="btn-label">Скачать</span>
    </button>
  </div>
  <div class="divider"></div>
  <div class="btn-group">
    <button class="btn" id="btn-sample" data-tooltip="Загрузить пример">
      ${icons.sample}<span class="btn-label">Пример</span>
    </button>
    <button class="btn btn-danger" id="btn-clear" data-tooltip="Очистить редактор">
      ${icons.clear}<span class="btn-label">Очистить</span>
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
      <button class="btn" id="modal-cancel">Отмена</button>
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
const visitCount = Number(localStorage.getItem('json-editor-visits') || '0') + 1;
localStorage.setItem('json-editor-visits', String(visitCount));
footer.innerHTML = `
  <span>DevTools Online</span>
  <span class="footer-sep">·</span>
  <span>12 инструментов</span>
  <span class="footer-sep">·</span>
  <span>Всё работает в браузере</span>
  <span class="footer-sep">·</span>
  <span class="visit-counter">Посещений: <strong id="visit-count">${visitCount}</strong></span>
`;
app.appendChild(footer);

// Try to get global visit count from counter API
const counterImg = new Image();
counterImg.src = 'https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Falexkostromin.github.io%2Fjson_editor&count_bg=%231e293b&title_bg=%231e293b&icon=&icon_color=%23E7E7E7&title=&edge_flat=true';
counterImg.style.display = 'none';
document.body.appendChild(counterImg);

// ========== Sample data ==========
const sampleJson = {
  name: 'DevTools Online',
  description: 'Онлайн инструменты для разработчика',
  version: '1.0.0',
  features: ['tree view', 'text mode', 'table mode', 'search', 'formatting'],
  author: { name: 'User', email: 'user@example.com' },
  tags: ['json', 'editor', 'tool'],
  settings: { theme: 'light', fontSize: 14, autoFormat: true },
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

// ========== JSON Button Handlers ==========

document.getElementById('btn-format')!.addEventListener('click', () => {
  try { editor.set({ json: JSON.parse(getTextContent()) }); showToast('JSON отформатирован'); }
  catch { showToast('Ошибка: невалидный JSON'); }
});

document.getElementById('btn-compact')!.addEventListener('click', () => {
  try { editor.set({ text: JSON.stringify(JSON.parse(getTextContent())) }); showToast('JSON сжат'); }
  catch { showToast('Ошибка: невалидный JSON'); }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  editor.set({ text: '' }); showToast('Очищено');
});

document.getElementById('btn-copy')!.addEventListener('click', () => {
  navigator.clipboard.writeText(getFormattedContent()).then(() => showToast('Скопировано'));
});

document.getElementById('btn-paste')!.addEventListener('click', () => {
  navigator.clipboard.readText().then((text) => {
    try { editor.set({ json: JSON.parse(text) }); showToast('JSON вставлен'); }
    catch { editor.set({ text }); showToast('Текст вставлен'); }
  }).catch(() => showToast('Нет доступа к буферу'));
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson }); showToast('Пример загружен');
});

document.getElementById('btn-upload')!.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const text = reader.result as string;
    try { editor.set({ json: JSON.parse(text) }); showToast(`${file.name} загружен`); }
    catch { editor.set({ text }); showToast('Файл загружен'); }
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
  showToast('Файл скачан');
});

// ========== Tool Handlers ==========

// JWT
document.getElementById('btn-jwt-header')!.addEventListener('click', () => {
  openModal('JWT Decoder', '<textarea id="tool-input" placeholder="Вставьте JWT токен (eyJhbG...)..." rows="4"></textarea>', 'Декодировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast('Вставьте JWT токен'); return; }
    try { editor.set({ json: decodeJwt(v) }); closeModal(); showToast('JWT декодирован'); }
    catch (e) { showToast(e instanceof Error ? e.message : 'Ошибка'); }
  });
});

// Base64
document.getElementById('btn-base64')!.addEventListener('click', () => {
  openModal('Base64 Encode / Decode',
    `<textarea id="tool-input" placeholder="Введите текст или Base64 строку..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="b64dir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="b64dir" value="decode" /> Decode</label>
     </div>`, 'Конвертировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Введите текст'); return; }
    const dir = (document.querySelector('input[name="b64dir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? base64Encode(v) : base64Decode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(`Base64 ${dir === 'encode' ? 'закодировано' : 'декодировано'}`);
    } catch { showToast('Ошибка: невалидные данные'); }
  });
});

// URL
document.getElementById('btn-url')!.addEventListener('click', () => {
  openModal('URL Encode / Decode',
    `<textarea id="tool-input" placeholder="Введите URL или текст..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="urldir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="urldir" value="decode" /> Decode</label>
     </div>`, 'Конвертировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Введите текст'); return; }
    const dir = (document.querySelector('input[name="urldir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? urlEncode(v) : urlDecode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(`URL ${dir === 'encode' ? 'закодирован' : 'декодирован'}`);
    } catch { showToast('Ошибка'); }
  });
});

// Timestamp
document.getElementById('btn-timestamp')!.addEventListener('click', () => {
  openModal('Unix Timestamp конвертер',
    '<textarea id="tool-input" placeholder="Unix timestamp (1710000000)... Пусто = текущее время" rows="2"></textarea>',
    'Конвертировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    try {
      editor.set({ json: JSON.parse(v ? timestampToDate(v) : dateToTimestamp()) });
      closeModal(); showToast(v ? 'Timestamp конвертирован' : 'Текущее время');
    } catch { showToast('Невалидный timestamp'); }
  });
});

// UUID
document.getElementById('btn-uuid')!.addEventListener('click', () => {
  const uuids = generateUUIDs(5);
  editor.set({ json: { generated: uuids, count: uuids.length, version: 'v4 (random)' } });
  showToast('5 UUID сгенерировано');
});

// YAML
document.getElementById('btn-yaml')!.addEventListener('click', () => {
  openModal('YAML ↔ JSON конвертер',
    `<textarea id="tool-input" placeholder="Вставьте JSON или YAML..." rows="6"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="yamldir" value="json-to-yaml" checked /> JSON → YAML</label>
       <label><input type="radio" name="yamldir" value="yaml-to-json" /> YAML → JSON</label>
     </div>`, 'Конвертировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v.trim()) { showToast('Вставьте данные'); return; }
    const dir = (document.querySelector('input[name="yamldir"]:checked') as HTMLInputElement).value;
    try {
      if (dir === 'json-to-yaml') {
        const yamlStr = jsonToYaml(v);
        editor.set({ text: yamlStr });
        closeModal(); showToast('Конвертировано в YAML');
      } else {
        const jsonStr = yamlToJson(v);
        editor.set({ json: JSON.parse(jsonStr) });
        closeModal(); showToast('Конвертировано в JSON');
      }
    } catch { showToast('Ошибка конвертации'); }
  });
});

// JSON Schema
document.getElementById('btn-schema')!.addEventListener('click', () => {
  try {
    const schema = generateJsonSchema(getTextContent());
    editor.set({ json: schema });
    showToast('JSON Schema сгенерирована');
  } catch { showToast('Ошибка: невалидный JSON'); }
});

// Hash
document.getElementById('btn-hash')!.addEventListener('click', () => {
  openModal('Hash Generator',
    '<textarea id="tool-input" placeholder="Введите текст для хэширования..." rows="4"></textarea>',
    'Сгенерировать', () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast('Введите текст'); return; }
    generateHashes(v).then((hashes) => {
      editor.set({ json: hashes });
      closeModal(); showToast('Хэши сгенерированы');
    });
  });
});

// Regex
document.getElementById('btn-regex')!.addEventListener('click', () => {
  openModal('Regex Tester',
    `<div class="modal-field-group">
       <input id="regex-pattern" type="text" placeholder="Регулярное выражение (например: \\d+)" />
       <input id="regex-flags" type="text" placeholder="Флаги (g, i, m...)" value="g" style="width:80px" />
     </div>
     <textarea id="tool-input" placeholder="Текст для проверки..." rows="4"></textarea>`,
    'Тестировать', () => {
    const pattern = (document.getElementById('regex-pattern') as HTMLInputElement).value;
    const flags = (document.getElementById('regex-flags') as HTMLInputElement).value;
    const text = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!pattern) { showToast('Введите regex'); return; }
    try {
      editor.set({ json: testRegex(pattern, flags, text) });
      closeModal(); showToast('Regex протестирован');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Невалидный regex'); }
  });
});

// Color
document.getElementById('btn-color')!.addEventListener('click', () => {
  openModal('Color Converter',
    '<input id="tool-input" type="text" placeholder="HEX (#ff0000), RGB (rgb(255,0,0)) или HSL (hsl(0,100%,50%))" />',
    'Конвертировать', () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value;
    if (!v) { showToast('Введите цвет'); return; }
    try {
      const result = convertColor(v);
      editor.set({ json: result });
      closeModal(); showToast('Цвет конвертирован');
    } catch (e) { showToast(e instanceof Error ? e.message : 'Ошибка'); }
  });
});

// JSON Diff
document.getElementById('btn-diff')!.addEventListener('click', () => {
  openModal('JSON Diff — сравнение двух JSON',
    `<textarea id="diff-input-1" placeholder="Первый JSON..." rows="4"></textarea>
     <textarea id="diff-input-2" placeholder="Второй JSON..." rows="4" style="margin-top:8px"></textarea>`,
    'Сравнить', () => {
    const v1 = (document.getElementById('diff-input-1') as HTMLTextAreaElement).value;
    const v2 = (document.getElementById('diff-input-2') as HTMLTextAreaElement).value;
    if (!v1 || !v2) { showToast('Заполните оба поля'); return; }
    try {
      editor.set({ json: jsonDiff(v1, v2) });
      closeModal(); showToast('Сравнение выполнено');
    } catch { showToast('Ошибка: невалидный JSON'); }
  });
});

// Mock Data
document.getElementById('btn-mock')!.addEventListener('click', () => {
  openModal('Mock Data Generator',
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">Количество записей:</label>
       <input id="tool-input" type="number" value="10" min="1" max="100" style="width:80px" />
     </div>`,
    'Сгенерировать', () => {
    const count = Math.min(100, Math.max(1, Number((document.getElementById('tool-input') as HTMLInputElement).value) || 10));
    const data = generateMockUsers(count);
    editor.set({ json: data });
    closeModal(); showToast(`${count} записей сгенерировано`);
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

const savedTheme = localStorage.getItem('json-editor-theme');
const isDark = savedTheme !== 'light';
themeSwitch.checked = isDark;
applyTheme(isDark);

themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked);
  localStorage.setItem('json-editor-theme', themeSwitch.checked ? 'dark' : 'light');
});
