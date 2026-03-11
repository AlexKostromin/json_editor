import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import { base64Encode, base64Decode, urlEncode, urlDecode, timestampToDate, dateToTimestamp, generateUUIDs, decodeJwt } from './tools';
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
  tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
};

// ========== Header ==========
const header = document.createElement('header');
header.innerHTML = `
  <div class="header-left">
    <div class="logo-icon">{ }</div>
    <h1>JSON <span>Editor</span></h1>
    <div class="header-badge">Online</div>
  </div>
  <div class="header-right-section">
    <button class="header-tool-btn header-jwt-btn" id="btn-jwt-header">
      ${icons.jwt}<span>JWT</span>
    </button>
    <button class="header-tool-btn header-base64-btn" id="btn-base64">
      <span>B64</span>
    </button>
    <button class="header-tool-btn header-url-btn" id="btn-url">
      <span>URL</span>
    </button>
    <button class="header-tool-btn header-timestamp-btn" id="btn-timestamp">
      <span>Time</span>
    </button>
    <button class="header-tool-btn header-uuid-btn" id="btn-uuid">
      <span>UUID</span>
    </button>
    <label class="theme-btn" title="Переключить тему">
      <input type="checkbox" id="theme-switch" />
      <span id="theme-icon">☀️</span>
    </label>
  </div>
`;
app.appendChild(header);

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
fileInput.accept = '.json,application/json';
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

const sampleJson = {
  name: 'JSON Editor',
  description: 'Онлайн-редактор JSON',
  version: '1.0.0',
  features: ['tree view', 'text mode', 'table mode', 'search', 'formatting'],
  author: {
    name: 'User',
    email: 'user@example.com',
  },
  tags: ['json', 'editor', 'tool'],
  settings: {
    theme: 'light',
    fontSize: 14,
    autoFormat: true,
  },
};

let content: { json: unknown } | { text: string } = {
  json: sampleJson,
};

const editorProps: JSONEditorPropsOptional = {
  content,
  navigationBar: false,
  onRenderContextMenu: () => false,
  onChange: (updatedContent) => {
    content = updatedContent as typeof content;
  },
};

const editor = createJSONEditor({
  target: editorWrapper,
  props: editorProps,
});

editor.updateProps({ navigationBar: false });

// Helpers
function getTextContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json);
}

function getFormattedContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json, null, 2);
}

// ========== JSON Button Handlers ==========

document.getElementById('btn-format')!.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(getTextContent());
    editor.set({ json: parsed });
    showToast('JSON отформатирован');
  } catch {
    showToast('Ошибка: невалидный JSON');
  }
});

document.getElementById('btn-compact')!.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(getTextContent());
    editor.set({ text: JSON.stringify(parsed) });
    showToast('JSON сжат в одну строку');
  } catch {
    showToast('Ошибка: невалидный JSON');
  }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  editor.set({ text: '' });
  showToast('Редактор очищен');
});

document.getElementById('btn-copy')!.addEventListener('click', () => {
  const text = getFormattedContent();
  navigator.clipboard.writeText(text).then(() => {
    showToast('Скопировано в буфер обмена');
  });
});

document.getElementById('btn-paste')!.addEventListener('click', () => {
  navigator.clipboard.readText().then((text) => {
    try {
      const parsed = JSON.parse(text);
      editor.set({ json: parsed });
      showToast('JSON вставлен');
    } catch {
      editor.set({ text });
      showToast('Текст вставлен');
    }
  }).catch(() => {
    showToast('Нет доступа к буферу обмена');
  });
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson });
  showToast('Пример загружен');
});

// Upload JSON file
document.getElementById('btn-upload')!.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result as string);
      editor.set({ json: parsed });
      showToast(`Файл "${file.name}" загружен`);
    } catch {
      editor.set({ text: reader.result as string });
      showToast('Файл загружен (не JSON)');
    }
  };
  reader.readAsText(file);
  fileInput.value = '';
});

// Download JSON file
document.getElementById('btn-download')!.addEventListener('click', () => {
  const text = getFormattedContent();
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Файл скачан');
});

// ========== Tool Handlers ==========

// JWT
document.getElementById('btn-jwt-header')!.addEventListener('click', () => {
  openModal(
    'Декодировать JWT токен',
    '<textarea id="tool-input" placeholder="Вставьте JWT токен (eyJhbG...)..." rows="4"></textarea>',
    'Декодировать',
    () => {
      const input = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
      if (!input) { showToast('Вставьте JWT токен'); return; }
      try {
        const result = decodeJwt(input);
        editor.set({ json: result });
        closeModal();
        showToast('JWT токен декодирован');
      } catch (e) {
        showToast(e instanceof Error ? e.message : 'Ошибка декодирования JWT');
      }
    }
  );
});

// Base64
document.getElementById('btn-base64')!.addEventListener('click', () => {
  openModal(
    'Base64 Encode / Decode',
    `<textarea id="tool-input" placeholder="Введите текст или Base64 строку..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="b64dir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="b64dir" value="decode" /> Decode</label>
     </div>`,
    'Конвертировать',
    () => {
      const input = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
      if (!input) { showToast('Введите текст'); return; }
      const direction = (document.querySelector('input[name="b64dir"]:checked') as HTMLInputElement).value;
      try {
        const result = direction === 'encode' ? base64Encode(input) : base64Decode(input);
        editor.set({ text: JSON.stringify({ input, direction, result }, null, 2) });
        closeModal();
        showToast(`Base64 ${direction === 'encode' ? 'закодировано' : 'декодировано'}`);
      } catch {
        showToast('Ошибка: невалидные данные');
      }
    }
  );
});

// URL encode/decode
document.getElementById('btn-url')!.addEventListener('click', () => {
  openModal(
    'URL Encode / Decode',
    `<textarea id="tool-input" placeholder="Введите URL или текст..." rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="urldir" value="encode" checked /> Encode</label>
       <label><input type="radio" name="urldir" value="decode" /> Decode</label>
     </div>`,
    'Конвертировать',
    () => {
      const input = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
      if (!input) { showToast('Введите текст'); return; }
      const direction = (document.querySelector('input[name="urldir"]:checked') as HTMLInputElement).value;
      try {
        const result = direction === 'encode' ? urlEncode(input) : urlDecode(input);
        editor.set({ text: JSON.stringify({ input, direction, result }, null, 2) });
        closeModal();
        showToast(`URL ${direction === 'encode' ? 'закодирован' : 'декодирован'}`);
      } catch {
        showToast('Ошибка: невалидные данные');
      }
    }
  );
});

// Timestamp
document.getElementById('btn-timestamp')!.addEventListener('click', () => {
  openModal(
    'Unix Timestamp конвертер',
    `<textarea id="tool-input" placeholder="Введите Unix timestamp (например 1710000000)... Оставьте пустым для текущего времени" rows="2"></textarea>`,
    'Конвертировать',
    () => {
      const input = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
      try {
        const result = input ? timestampToDate(input) : dateToTimestamp();
        editor.set({ json: JSON.parse(result) });
        closeModal();
        showToast(input ? 'Timestamp конвертирован' : 'Текущее время');
      } catch {
        showToast('Ошибка: невалидный timestamp');
      }
    }
  );
});

// UUID
document.getElementById('btn-uuid')!.addEventListener('click', () => {
  const uuids = generateUUIDs(5);
  editor.set({
    json: {
      generated: uuids,
      count: uuids.length,
      version: 'v4 (random)',
    },
  });
  showToast('5 UUID сгенерировано');
});

// ========== Theme ==========
const themeSwitch = document.getElementById('theme-switch') as HTMLInputElement;
const themeIcon = document.getElementById('theme-icon')!;

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent = '☀️';
  }
}

const savedTheme = localStorage.getItem('json-editor-theme');
const isDark = savedTheme !== 'light';
themeSwitch.checked = isDark;
applyTheme(isDark);

themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked);
  localStorage.setItem('json-editor-theme', themeSwitch.checked ? 'dark' : 'light');
});