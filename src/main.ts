import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import './style.css';

const app = document.getElementById('app')!;

// Icons (inline SVG)
const icons = {
  format: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>',
  compact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
  clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  sample: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  paste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
};

// Header
const header = document.createElement('header');
header.innerHTML = `
  <div class="header-left">
    <h1>{ } JSON Editor</h1>
  </div>
  <div class="header-right">
    <button class="btn btn-accent" id="btn-format" data-tooltip="Форматировать JSON">
      ${icons.format}<span class="btn-label">Форматировать</span>
    </button>
    <button class="btn" id="btn-compact" data-tooltip="Сжать в одну строку">
      ${icons.compact}<span class="btn-label">Сжать</span>
    </button>
    <div class="separator"></div>
    <button class="btn" id="btn-copy" data-tooltip="Копировать в буфер">
      ${icons.copy}<span class="btn-label">Копировать</span>
    </button>
    <button class="btn" id="btn-paste" data-tooltip="Вставить из буфера">
      ${icons.paste}<span class="btn-label">Вставить</span>
    </button>
    <div class="separator"></div>
    <button class="btn" id="btn-sample" data-tooltip="Загрузить пример">
      ${icons.sample}<span class="btn-label">Пример</span>
    </button>
    <button class="btn" id="btn-clear" data-tooltip="Очистить редактор">
      ${icons.clear}<span class="btn-label">Очистить</span>
    </button>
    <div class="separator"></div>
    <label class="theme-toggle" title="Переключить тему">
      <input type="checkbox" id="theme-switch" />
      <span id="theme-icon">☀️</span>
    </label>
  </div>
`;
app.appendChild(header);

// Toast element
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);

function showToast(message: string) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Editor container
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
  onChange: (updatedContent) => {
    content = updatedContent as typeof content;
  },
};

const editor = createJSONEditor({
  target: editorWrapper,
  props: editorProps,
});

// Helpers
function getTextContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json);
}

function getFormattedContent(): string {
  return 'text' in content ? content.text : JSON.stringify(content.json, null, 2);
}

// Button handlers
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
    showToast('JSON сжат');
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
      showToast('JSON вставлен из буфера');
    } catch {
      editor.set({ text });
      showToast('Текст вставлен из буфера');
    }
  }).catch(() => {
    showToast('Нет доступа к буферу обмена');
  });
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson });
  showToast('Пример загружен');
});

// Theme toggle
const themeSwitch = document.getElementById('theme-switch') as HTMLInputElement;
const themeIcon = document.getElementById('theme-icon')!;
const savedTheme = localStorage.getItem('json-editor-theme');

function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.textContent = '🌙';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.textContent = '☀️';
  }
}

if (savedTheme === 'dark') {
  themeSwitch.checked = true;
  applyTheme(true);
}

themeSwitch.addEventListener('change', () => {
  applyTheme(themeSwitch.checked);
  localStorage.setItem('json-editor-theme', themeSwitch.checked ? 'dark' : 'light');
});