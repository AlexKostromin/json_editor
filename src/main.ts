import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import './style.css';

const app = document.getElementById('app')!;

// Header
const header = document.createElement('header');
header.innerHTML = `
  <div class="header-left">
    <h1>{ } JSON Editor</h1>
  </div>
  <div class="header-right">
    <button id="btn-format" title="Форматировать">Форматировать</button>
    <button id="btn-compact" title="Сжать">Сжать</button>
    <button id="btn-clear" title="Очистить">Очистить</button>
    <button id="btn-copy" title="Копировать">Копировать</button>
    <button id="btn-sample" title="Загрузить пример">Пример</button>
    <label class="theme-toggle" title="Тёмная тема">
      <input type="checkbox" id="theme-switch" />
      <span>🌙</span>
    </label>
  </div>
`;
app.appendChild(header);

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
  } catch {
    alert('Невалидный JSON');
  }
});

document.getElementById('btn-compact')!.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(getTextContent());
    editor.set({ text: JSON.stringify(parsed) });
  } catch {
    alert('Невалидный JSON');
  }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  editor.set({ text: '' });
});

document.getElementById('btn-copy')!.addEventListener('click', () => {
  const text = getFormattedContent();
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById('btn-copy')!;
    btn.textContent = 'Скопировано!';
    setTimeout(() => (btn.textContent = 'Копировать'), 1500);
  });
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson });
});

// Theme toggle
const themeSwitch = document.getElementById('theme-switch') as HTMLInputElement;
const savedTheme = localStorage.getItem('json-editor-theme');
if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeSwitch.checked = true;
}

themeSwitch.addEventListener('change', () => {
  if (themeSwitch.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('json-editor-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('json-editor-theme', 'light');
  }
});