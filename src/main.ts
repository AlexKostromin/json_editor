import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
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

// ========== Button Handlers ==========

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