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

// ========== i18n ==========
const t = {
  en: {
    // Header/Footer
    '20_tools': '20 tools',
    'runs_in_browser': 'Everything runs in your browser',
    'visits': 'Visits',
    // Toolbar buttons
    'format': 'Format',
    'minify': 'Minify',
    'copy': 'Copy',
    'paste': 'Paste',
    'open': 'Open',
    'save': 'Save',
    'sample': 'Sample',
    'clear': 'Clear',
    // Tool chip labels
    'chip_json': 'JSON',
    'chip_jwt': 'JWT',
    'chip_base64': 'Base64',
    'chip_url': 'URL',
    'chip_timestamp': 'Timestamp',
    'chip_uuid': 'UUID',
    'chip_yaml': 'YAML',
    'chip_schema': 'Schema',
    'chip_hash': 'Hash',
    'chip_regex': 'Regex',
    'chip_color': 'Color',
    'chip_diff': 'Diff',
    'chip_mock': 'Mock',
    'chip_cron': 'Cron',
    'chip_password': 'Password',
    'chip_lorem': 'Lorem',
    'chip_base': 'Base',
    'chip_case': 'Case',
    'chip_entity': 'Entity',
    'chip_escape': 'Escape',
    'chip_query': 'Query',
    // Toast messages
    'json_formatted': 'JSON formatted',
    'json_minified': 'JSON minified',
    'cleared': 'Cleared',
    'copied': 'Copied',
    'json_pasted': 'JSON pasted',
    'text_pasted': 'Text pasted',
    'no_clipboard': 'No clipboard access',
    'sample_loaded': 'Sample loaded',
    'file_downloaded': 'File downloaded',
    'error_invalid_json': 'Error: invalid JSON',
    'paste_jwt': 'Paste a JWT token',
    'jwt_decoded': 'JWT decoded',
    'enter_text': 'Enter text',
    'base64_encoded': 'Base64 encoded',
    'base64_decoded': 'Base64 decoded',
    'error_invalid_data': 'Error: invalid data',
    'url_encoded': 'URL encoded',
    'url_decoded': 'URL decoded',
    'timestamp_converted': 'Timestamp converted',
    'current_time': 'Current time',
    'invalid_timestamp': 'Invalid timestamp',
    'uuids_generated': '5 UUIDs generated',
    'paste_data': 'Paste data',
    'converted_yaml': 'Converted to YAML',
    'converted_json': 'Converted to JSON',
    'conversion_error': 'Conversion error',
    'schema_generated': 'JSON Schema generated',
    'hashes_generated': 'Hashes generated',
    'enter_regex': 'Enter regex',
    'regex_tested': 'Regex tested',
    'enter_color': 'Enter a color',
    'color_converted': 'Color converted',
    'fill_both': 'Fill in both fields',
    'comparison_complete': 'Comparison complete',
    'enter_cron': 'Enter cron expression',
    'cron_parsed': 'Cron parsed',
    'passwords_generated': 'Passwords generated',
    'lorem_generated': 'Lorem Ipsum generated',
    'enter_number': 'Enter a number',
    'number_converted': 'Number converted',
    'case_converted': 'Case converted',
    'html_encoded': 'HTML entities encoded',
    'html_decoded': 'HTML entities decoded',
    'string_escaped': 'String escaped',
    'string_unescaped': 'String unescaped',
    'enter_data': 'Enter data',
    'converted': 'Converted',
    'json_editor': 'JSON Editor',
    'records_generated': 'records generated',
    // Modal titles
    'title_jwt': 'JWT Decoder',
    'title_base64': 'Base64 Encode / Decode',
    'title_url': 'URL Encode / Decode',
    'title_timestamp': 'Unix Timestamp Converter',
    'title_yaml': 'YAML ↔ JSON Converter',
    'title_hash': 'Hash Generator',
    'title_regex': 'Regex Tester',
    'title_color': 'Color Converter',
    'title_diff': 'JSON Diff — Compare Two JSON Objects',
    'title_mock': 'Mock Data Generator',
    'title_cron': 'Cron Expression Parser',
    'title_password': 'Password Generator',
    'title_lorem': 'Lorem Ipsum Generator',
    'title_numbase': 'Number Base Converter',
    'title_case': 'Case Converter',
    'title_htmlent': 'HTML Entity Encode / Decode',
    'title_strescape': 'String Escape / Unescape',
    'title_querystr': 'Query String ↔ JSON',
    // Placeholders
    'ph_jwt': 'Paste JWT token (eyJhbG...)...',
    'ph_base64': 'Enter text or Base64 string...',
    'ph_url': 'Enter URL or text...',
    'ph_timestamp': 'Unix timestamp (1710000000)... Empty = current time',
    'ph_yaml': 'Paste JSON or YAML...',
    'ph_hash': 'Enter text to hash...',
    'ph_regex_pattern': 'Regular expression (e.g.: \\d+)',
    'ph_regex_flags': 'Flags (g, i, m...)',
    'ph_regex_text': 'Text to test...',
    'ph_color': 'HEX (#ff0000), RGB (rgb(255,0,0)) or HSL (hsl(0,100%,50%))',
    'ph_diff1': 'First JSON...',
    'ph_diff2': 'Second JSON...',
    'ph_mock_count': 'Number of records:',
    'ph_cron': 'Cron expression (e.g. */5 * * * *)',
    'ph_pw_length': 'Length:',
    'ph_pw_count': 'Count:',
    'ph_numbase': 'Enter number (e.g. 255, 0xFF, 0b1010)',
    'ph_case': 'Enter text (e.g. hello world, helloWorld, hello_world)',
    'ph_htmlent': 'Enter text or HTML entities...',
    'ph_strescape': 'Enter string to escape or unescape...',
    'ph_querystr': 'Query string (?foo=1&bar=2) or JSON ...',
    // Modal button labels
    'btn_encode': 'Encode',
    'btn_decode': 'Decode',
    'btn_convert': 'Convert',
    'btn_generate': 'Generate',
    'btn_parse': 'Parse',
    'btn_test': 'Test',
    'btn_compare': 'Compare',
    'btn_cancel': 'Cancel',
    'btn_paragraphs': 'Paragraphs',
    'btn_sentences': 'Sentences',
    'btn_words': 'Words',
    'btn_decimal': 'Decimal',
    'btn_hex': 'Hex',
    'btn_binary': 'Binary',
    'btn_octal': 'Octal',
    'btn_escape': 'Escape',
    'btn_unescape': 'Unescape',
    'btn_query_json': 'Query → JSON',
    'btn_json_query': 'JSON → Query',
    'btn_json_yaml': 'JSON → YAML',
    'btn_yaml_json': 'YAML → JSON',
    // Tooltip
    'tip_format': 'Format JSON',
    'tip_minify': 'Minify to one line',
    'tip_copy': 'Copy',
    'tip_paste': 'Paste from clipboard',
    'tip_upload': 'Upload file',
    'tip_download': 'Download JSON',
    'tip_sample': 'Load sample',
    'tip_clear': 'Clear editor',
  },
  ru: {
    // Header/Footer
    '20_tools': '20 инструментов',
    'runs_in_browser': 'Всё работает в браузере',
    'visits': 'Посещения',
    // Toolbar buttons
    'format': 'Форматировать',
    'minify': 'Сжать',
    'copy': 'Копировать',
    'paste': 'Вставить',
    'open': 'Открыть',
    'save': 'Сохранить',
    'sample': 'Пример',
    'clear': 'Очистить',
    // Tool chip labels
    'chip_json': 'JSON',
    'chip_jwt': 'JWT',
    'chip_base64': 'Base64',
    'chip_url': 'URL',
    'chip_timestamp': 'Время',
    'chip_uuid': 'UUID',
    'chip_yaml': 'YAML',
    'chip_schema': 'Схема',
    'chip_hash': 'Хеш',
    'chip_regex': 'Regex',
    'chip_color': 'Цвет',
    'chip_diff': 'Сравн.',
    'chip_mock': 'Мок',
    'chip_cron': 'Cron',
    'chip_password': 'Пароль',
    'chip_lorem': 'Lorem',
    'chip_base': 'Базис',
    'chip_case': 'Регистр',
    'chip_entity': 'Сущн.',
    'chip_escape': 'Экран.',
    'chip_query': 'Запрос',
    // Toast messages
    'json_formatted': 'JSON отформатирован',
    'json_minified': 'JSON сжат',
    'cleared': 'Очищено',
    'copied': 'Скопировано',
    'json_pasted': 'JSON вставлен',
    'text_pasted': 'Текст вставлен',
    'no_clipboard': 'Нет доступа к буферу',
    'sample_loaded': 'Пример загружен',
    'file_downloaded': 'Файл скачан',
    'error_invalid_json': 'Ошибка: невалидный JSON',
    'paste_jwt': 'Вставьте JWT токен',
    'jwt_decoded': 'JWT декодирован',
    'enter_text': 'Введите текст',
    'base64_encoded': 'Base64 закодирован',
    'base64_decoded': 'Base64 декодирован',
    'error_invalid_data': 'Ошибка: неверные данные',
    'url_encoded': 'URL закодирован',
    'url_decoded': 'URL декодирован',
    'timestamp_converted': 'Время конвертировано',
    'current_time': 'Текущее время',
    'invalid_timestamp': 'Неверная метка времени',
    'uuids_generated': '5 UUID сгенерировано',
    'paste_data': 'Вставьте данные',
    'converted_yaml': 'Конвертировано в YAML',
    'converted_json': 'Конвертировано в JSON',
    'conversion_error': 'Ошибка конвертации',
    'schema_generated': 'JSON Schema сгенерирована',
    'hashes_generated': 'Хеши сгенерированы',
    'enter_regex': 'Введите регулярку',
    'regex_tested': 'Regex проверен',
    'enter_color': 'Введите цвет',
    'color_converted': 'Цвет конвертирован',
    'fill_both': 'Заполните оба поля',
    'comparison_complete': 'Сравнение завершено',
    'enter_cron': 'Введите cron выражение',
    'cron_parsed': 'Cron разобран',
    'passwords_generated': 'Пароли сгенерированы',
    'lorem_generated': 'Lorem Ipsum сгенерирован',
    'enter_number': 'Введите число',
    'number_converted': 'Число конвертировано',
    'case_converted': 'Регистр конвертирован',
    'html_encoded': 'HTML сущности закодированы',
    'html_decoded': 'HTML сущности декодированы',
    'string_escaped': 'Строка экранирована',
    'string_unescaped': 'Строка деэкранирована',
    'enter_data': 'Введите данные',
    'converted': 'Конвертировано',
    'json_editor': 'JSON Редактор',
    'records_generated': 'записей сгенерировано',
    // Modal titles
    'title_jwt': 'Декодер JWT',
    'title_base64': 'Base64 Кодирование / Декодирование',
    'title_url': 'URL Кодирование / Декодирование',
    'title_timestamp': 'Конвертер Unix Timestamp',
    'title_yaml': 'YAML ↔ JSON Конвертер',
    'title_hash': 'Генератор хешей',
    'title_regex': 'Тестер регулярных выражений',
    'title_color': 'Конвертер цветов',
    'title_diff': 'JSON Diff — Сравнение двух объектов',
    'title_mock': 'Генератор тестовых данных',
    'title_cron': 'Парсер Cron выражений',
    'title_password': 'Генератор паролей',
    'title_lorem': 'Генератор Lorem Ipsum',
    'title_numbase': 'Конвертер систем счисления',
    'title_case': 'Конвертер регистра',
    'title_htmlent': 'HTML Сущности Кодирование / Декодирование',
    'title_strescape': 'Экранирование / Деэкранирование строк',
    'title_querystr': 'Строка запроса ↔ JSON',
    // Placeholders
    'ph_jwt': 'Вставьте JWT токен (eyJhbG...)...',
    'ph_base64': 'Введите текст или Base64 строку...',
    'ph_url': 'Введите URL или текст...',
    'ph_timestamp': 'Unix timestamp (1710000000)... Пустое = текущее время',
    'ph_yaml': 'Вставьте JSON или YAML...',
    'ph_hash': 'Введите текст для хеширования...',
    'ph_regex_pattern': 'Регулярное выражение (напр.: \\d+)',
    'ph_regex_flags': 'Флаги (g, i, m...)',
    'ph_regex_text': 'Текст для проверки...',
    'ph_color': 'HEX (#ff0000), RGB (rgb(255,0,0)) или HSL (hsl(0,100%,50%))',
    'ph_diff1': 'Первый JSON...',
    'ph_diff2': 'Второй JSON...',
    'ph_mock_count': 'Количество записей:',
    'ph_cron': 'Cron выражение (напр. */5 * * * *)',
    'ph_pw_length': 'Длина:',
    'ph_pw_count': 'Количество:',
    'ph_numbase': 'Введите число (напр. 255, 0xFF, 0b1010)',
    'ph_case': 'Введите текст (напр. hello world, helloWorld, hello_world)',
    'ph_htmlent': 'Введите текст или HTML сущности...',
    'ph_strescape': 'Введите строку для экранирования...',
    'ph_querystr': 'Строка запроса (?foo=1&bar=2) или JSON ...',
    // Modal button labels
    'btn_encode': 'Кодировать',
    'btn_decode': 'Декодировать',
    'btn_convert': 'Конвертировать',
    'btn_generate': 'Генерировать',
    'btn_parse': 'Разобрать',
    'btn_test': 'Проверить',
    'btn_compare': 'Сравнить',
    'btn_cancel': 'Отмена',
    'btn_paragraphs': 'Абзацы',
    'btn_sentences': 'Предложения',
    'btn_words': 'Слова',
    'btn_decimal': 'Десятичная',
    'btn_hex': 'Шестнадцатеричная',
    'btn_binary': 'Двоичная',
    'btn_octal': 'Восьмеричная',
    'btn_escape': 'Экранировать',
    'btn_unescape': 'Деэкранировать',
    'btn_query_json': 'Запрос → JSON',
    'btn_json_query': 'JSON → Запрос',
    'btn_json_yaml': 'JSON → YAML',
    'btn_yaml_json': 'YAML → JSON',
    // Tooltip
    'tip_format': 'Форматировать JSON',
    'tip_minify': 'Сжать в одну строку',
    'tip_copy': 'Копировать',
    'tip_paste': 'Вставить из буфера',
    'tip_upload': 'Загрузить файл',
    'tip_download': 'Скачать JSON',
    'tip_sample': 'Загрузить пример',
    'tip_clear': 'Очистить редактор',
  },
} as const;

type LangKey = keyof typeof t.en;

let lang: 'en' | 'ru' = (localStorage.getItem('devtools-lang') || (navigator.language.startsWith('ru') ? 'ru' : 'en')) as 'en' | 'ru';

function tr(key: LangKey): string {
  return t[lang][key] || t.en[key] || key;
}

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
    <button class="lang-btn" id="lang-switch">${lang.toUpperCase()}</button>
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
      <button class="btn" id="modal-cancel">${tr('btn_cancel')}</button>
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
  <span id="footer-tools">${tr('20_tools')}</span>
  <span class="footer-sep">·</span>
  <span id="footer-browser">${tr('runs_in_browser')}</span>
  <span class="footer-sep">·</span>
  <span class="visit-counter"><span id="footer-visits">${tr('visits')}</span>: <strong id="visit-count">...</strong></span>
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
  showToast(tr('json_editor'));
});

// ========== JSON Button Handlers ==========

document.getElementById('btn-format')!.addEventListener('click', () => {
  try { editor.set({ json: JSON.parse(getTextContent()) }); showToast(tr('json_formatted')); }
  catch { showToast(tr('error_invalid_json')); }
});

document.getElementById('btn-compact')!.addEventListener('click', () => {
  try { editor.set({ text: JSON.stringify(JSON.parse(getTextContent())) }); showToast(tr('json_minified')); }
  catch { showToast(tr('error_invalid_json')); }
});

document.getElementById('btn-clear')!.addEventListener('click', () => {
  editor.set({ text: '' }); showToast(tr('cleared'));
});

document.getElementById('btn-copy')!.addEventListener('click', () => {
  navigator.clipboard.writeText(getFormattedContent()).then(() => showToast(tr('copied')));
});

document.getElementById('btn-paste')!.addEventListener('click', () => {
  navigator.clipboard.readText().then((text) => {
    try { editor.set({ json: JSON.parse(text) }); showToast(tr('json_pasted')); }
    catch { editor.set({ text }); showToast(tr('text_pasted')); }
  }).catch(() => showToast(tr('no_clipboard')));
});

document.getElementById('btn-sample')!.addEventListener('click', () => {
  editor.set({ json: sampleJson }); showToast(tr('sample_loaded'));
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
  showToast(tr('file_downloaded'));
});

// ========== Tool Handlers ==========

// JWT
document.getElementById('btn-jwt-header')!.addEventListener('click', () => {
  openModal(tr('title_jwt'), `<textarea id="tool-input" placeholder="${tr('ph_jwt')}" rows="4"></textarea>`, tr('btn_decode'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast(tr('paste_jwt')); return; }
    try { editor.set({ json: decodeJwt(v) }); closeModal(); showToast(tr('jwt_decoded')); }
    catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Base64
document.getElementById('btn-base64')!.addEventListener('click', () => {
  openModal(tr('title_base64'),
    `<textarea id="tool-input" placeholder="${tr('ph_base64')}" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="b64dir" value="encode" checked /> ${tr('btn_encode')}</label>
       <label><input type="radio" name="b64dir" value="decode" /> ${tr('btn_decode')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast(tr('enter_text')); return; }
    const dir = (document.querySelector('input[name="b64dir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? base64Encode(v) : base64Decode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(dir === 'encode' ? tr('base64_encoded') : tr('base64_decoded'));
    } catch { showToast(tr('error_invalid_data')); }
  });
});

// URL
document.getElementById('btn-url')!.addEventListener('click', () => {
  openModal(tr('title_url'),
    `<textarea id="tool-input" placeholder="${tr('ph_url')}" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="urldir" value="encode" checked /> ${tr('btn_encode')}</label>
       <label><input type="radio" name="urldir" value="decode" /> ${tr('btn_decode')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast(tr('enter_text')); return; }
    const dir = (document.querySelector('input[name="urldir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'encode' ? urlEncode(v) : urlDecode(v);
      editor.set({ text: JSON.stringify({ input: v, direction: dir, result }, null, 2) });
      closeModal(); showToast(dir === 'encode' ? tr('url_encoded') : tr('url_decoded'));
    } catch { showToast('Error'); }
  });
});

// Timestamp
document.getElementById('btn-timestamp')!.addEventListener('click', () => {
  openModal(tr('title_timestamp'),
    `<textarea id="tool-input" placeholder="${tr('ph_timestamp')}" rows="2"></textarea>`,
    tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    try {
      editor.set({ json: JSON.parse(v ? timestampToDate(v) : dateToTimestamp()) });
      closeModal(); showToast(v ? tr('timestamp_converted') : tr('current_time'));
    } catch { showToast(tr('invalid_timestamp')); }
  });
});

// UUID
document.getElementById('btn-uuid')!.addEventListener('click', () => {
  const uuids = generateUUIDs(5);
  editor.set({ json: { generated: uuids, count: uuids.length, version: 'v4 (random)' } });
  showToast(tr('uuids_generated'));
});

// YAML
document.getElementById('btn-yaml')!.addEventListener('click', () => {
  openModal(tr('title_yaml'),
    `<textarea id="tool-input" placeholder="${tr('ph_yaml')}" rows="6"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="yamldir" value="json-to-yaml" checked /> ${tr('btn_json_yaml')}</label>
       <label><input type="radio" name="yamldir" value="yaml-to-json" /> ${tr('btn_yaml_json')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v.trim()) { showToast(tr('paste_data')); return; }
    const dir = (document.querySelector('input[name="yamldir"]:checked') as HTMLInputElement).value;
    try {
      if (dir === 'json-to-yaml') {
        const yamlStr = jsonToYaml(v);
        editor.set({ text: yamlStr });
        closeModal(); showToast(tr('converted_yaml'));
      } else {
        const jsonStr = yamlToJson(v);
        editor.set({ json: JSON.parse(jsonStr) });
        closeModal(); showToast(tr('converted_json'));
      }
    } catch { showToast(tr('conversion_error')); }
  });
});

// JSON Schema
document.getElementById('btn-schema')!.addEventListener('click', () => {
  try {
    const schema = generateJsonSchema(getTextContent());
    editor.set({ json: schema });
    showToast(tr('schema_generated'));
  } catch { showToast(tr('error_invalid_json')); }
});

// Hash
document.getElementById('btn-hash')!.addEventListener('click', () => {
  openModal(tr('title_hash'),
    `<textarea id="tool-input" placeholder="${tr('ph_hash')}" rows="4"></textarea>`,
    tr('btn_generate'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast(tr('enter_text')); return; }
    generateHashes(v).then((hashes) => {
      editor.set({ json: hashes });
      closeModal(); showToast(tr('hashes_generated'));
    });
  });
});

// Regex
document.getElementById('btn-regex')!.addEventListener('click', () => {
  openModal(tr('title_regex'),
    `<div class="modal-field-group">
       <input id="regex-pattern" type="text" placeholder="${tr('ph_regex_pattern')}" />
       <input id="regex-flags" type="text" placeholder="${tr('ph_regex_flags')}" value="g" style="width:80px" />
     </div>
     <textarea id="tool-input" placeholder="${tr('ph_regex_text')}" rows="4"></textarea>`,
    tr('btn_test'), () => {
    const pattern = (document.getElementById('regex-pattern') as HTMLInputElement).value;
    const flags = (document.getElementById('regex-flags') as HTMLInputElement).value;
    const text = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!pattern) { showToast(tr('enter_regex')); return; }
    try {
      editor.set({ json: testRegex(pattern, flags, text) });
      closeModal(); showToast(tr('regex_tested'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Invalid regex'); }
  });
});

// Color
document.getElementById('btn-color')!.addEventListener('click', () => {
  openModal(tr('title_color'),
    `<input id="tool-input" type="text" placeholder="${tr('ph_color')}" />`,
    tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value;
    if (!v) { showToast(tr('enter_color')); return; }
    try {
      const result = convertColor(v);
      editor.set({ json: result });
      closeModal(); showToast(tr('color_converted'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// JSON Diff
document.getElementById('btn-diff')!.addEventListener('click', () => {
  openModal(tr('title_diff'),
    `<textarea id="diff-input-1" placeholder="${tr('ph_diff1')}" rows="4"></textarea>
     <textarea id="diff-input-2" placeholder="${tr('ph_diff2')}" rows="4" style="margin-top:8px"></textarea>`,
    tr('btn_compare'), () => {
    const v1 = (document.getElementById('diff-input-1') as HTMLTextAreaElement).value;
    const v2 = (document.getElementById('diff-input-2') as HTMLTextAreaElement).value;
    if (!v1 || !v2) { showToast(tr('fill_both')); return; }
    try {
      editor.set({ json: jsonDiff(v1, v2) });
      closeModal(); showToast(tr('comparison_complete'));
    } catch { showToast(tr('error_invalid_json')); }
  });
});

// Mock Data
document.getElementById('btn-mock')!.addEventListener('click', () => {
  openModal(tr('title_mock'),
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">${tr('ph_mock_count')}</label>
       <input id="tool-input" type="number" value="10" min="1" max="100" style="width:80px" />
     </div>`,
    tr('btn_generate'), () => {
    const count = Math.min(100, Math.max(1, Number((document.getElementById('tool-input') as HTMLInputElement).value) || 10));
    const data = generateMockUsers(count);
    editor.set({ json: data });
    closeModal(); showToast(`${count} ${tr('records_generated')}`);
  });
});

// Cron Parser
document.getElementById('btn-cron')!.addEventListener('click', () => {
  openModal(tr('title_cron'),
    `<input id="tool-input" type="text" placeholder="${tr('ph_cron')}" />`,
    tr('btn_parse'), () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast(tr('enter_cron')); return; }
    try {
      editor.set({ json: parseCron(v) });
      closeModal(); showToast(tr('cron_parsed'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Password Generator
document.getElementById('btn-password')!.addEventListener('click', () => {
  openModal(tr('title_password'),
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">${tr('ph_pw_length')}</label>
       <input id="pw-length" type="number" value="16" min="4" max="128" style="width:80px" />
       <label style="color:#94a3b8;font-size:13px">${tr('ph_pw_count')}</label>
       <input id="pw-count" type="number" value="5" min="1" max="20" style="width:80px" />
     </div>
     <div class="modal-radio-group" style="flex-wrap:wrap">
       <label><input type="checkbox" name="pw-upper" checked /> A-Z</label>
       <label><input type="checkbox" name="pw-lower" checked /> a-z</label>
       <label><input type="checkbox" name="pw-nums" checked /> 0-9</label>
       <label><input type="checkbox" name="pw-syms" checked /> !@#$</label>
     </div>`,
    tr('btn_generate'), () => {
    const length = Math.min(128, Math.max(4, Number((document.getElementById('pw-length') as HTMLInputElement).value) || 16));
    const count = Math.min(20, Math.max(1, Number((document.getElementById('pw-count') as HTMLInputElement).value) || 5));
    const uppercase = (document.querySelector('input[name="pw-upper"]') as HTMLInputElement).checked;
    const lowercase = (document.querySelector('input[name="pw-lower"]') as HTMLInputElement).checked;
    const numbers = (document.querySelector('input[name="pw-nums"]') as HTMLInputElement).checked;
    const symbols = (document.querySelector('input[name="pw-syms"]') as HTMLInputElement).checked;
    try {
      editor.set({ json: generatePasswords(length, count, { uppercase, lowercase, numbers, symbols }) });
      closeModal(); showToast(tr('passwords_generated'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Lorem Ipsum Generator
document.getElementById('btn-lorem')!.addEventListener('click', () => {
  openModal(tr('title_lorem'),
    `<div class="modal-field-group">
       <label style="color:#94a3b8;font-size:13px">${tr('ph_pw_count')}</label>
       <input id="tool-input" type="number" value="5" min="1" max="100" style="width:80px" />
     </div>
     <div class="modal-radio-group">
       <label><input type="radio" name="loremmode" value="paragraphs" checked /> ${tr('btn_paragraphs')}</label>
       <label><input type="radio" name="loremmode" value="sentences" /> ${tr('btn_sentences')}</label>
       <label><input type="radio" name="loremmode" value="words" /> ${tr('btn_words')}</label>
     </div>`,
    tr('btn_generate'), () => {
    const count = Math.min(100, Math.max(1, Number((document.getElementById('tool-input') as HTMLInputElement).value) || 5));
    const mode = (document.querySelector('input[name="loremmode"]:checked') as HTMLInputElement).value as 'words' | 'sentences' | 'paragraphs';
    const result = generateLoremIpsum(mode, count);
    editor.set({ json: result });
    closeModal(); showToast(tr('lorem_generated'));
  });
});

// Number Base Converter
document.getElementById('btn-numbase')!.addEventListener('click', () => {
  openModal(tr('title_numbase'),
    `<input id="tool-input" type="text" placeholder="${tr('ph_numbase')}" />
     <div class="modal-radio-group">
       <label><input type="radio" name="numbase" value="10" checked /> ${tr('btn_decimal')}</label>
       <label><input type="radio" name="numbase" value="16" /> ${tr('btn_hex')}</label>
       <label><input type="radio" name="numbase" value="2" /> ${tr('btn_binary')}</label>
       <label><input type="radio" name="numbase" value="8" /> ${tr('btn_octal')}</label>
     </div>`,
    tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast(tr('enter_number')); return; }
    const base = parseInt((document.querySelector('input[name="numbase"]:checked') as HTMLInputElement).value);
    try {
      editor.set({ json: convertNumberBase(v, base) });
      closeModal(); showToast(tr('number_converted'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// Case Converter
document.getElementById('btn-casecvt')!.addEventListener('click', () => {
  openModal(tr('title_case'),
    `<input id="tool-input" type="text" placeholder="${tr('ph_case')}" />`,
    tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLInputElement).value.trim();
    if (!v) { showToast(tr('enter_text')); return; }
    editor.set({ json: convertCase(v) });
    closeModal(); showToast(tr('case_converted'));
  });
});

// HTML Entity Encode/Decode
document.getElementById('btn-htmlent')!.addEventListener('click', () => {
  openModal(tr('title_htmlent'),
    `<textarea id="tool-input" placeholder="${tr('ph_htmlent')}" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="htmldir" value="encode" checked /> ${tr('btn_encode')}</label>
       <label><input type="radio" name="htmldir" value="decode" /> ${tr('btn_decode')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast(tr('enter_text')); return; }
    const dir = (document.querySelector('input[name="htmldir"]:checked') as HTMLInputElement).value;
    const result = dir === 'encode' ? htmlEntityEncode(v) : htmlEntityDecode(v);
    editor.set({ json: { input: v, direction: dir, result } });
    closeModal(); showToast(dir === 'encode' ? tr('html_encoded') : tr('html_decoded'));
  });
});

// String Escape/Unescape
document.getElementById('btn-strescape')!.addEventListener('click', () => {
  openModal(tr('title_strescape'),
    `<textarea id="tool-input" placeholder="${tr('ph_strescape')}" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="escdir" value="escape" checked /> ${tr('btn_escape')}</label>
       <label><input type="radio" name="escdir" value="unescape" /> ${tr('btn_unescape')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v) { showToast(tr('enter_text')); return; }
    const dir = (document.querySelector('input[name="escdir"]:checked') as HTMLInputElement).value;
    const result = dir === 'escape' ? escapeString(v) : unescapeString(v);
    editor.set({ json: result });
    closeModal(); showToast(dir === 'escape' ? tr('string_escaped') : tr('string_unescaped'));
  });
});

// Query String ↔ JSON
document.getElementById('btn-querystr')!.addEventListener('click', () => {
  openModal(tr('title_querystr'),
    `<textarea id="tool-input" placeholder="${tr('ph_querystr')}" rows="4"></textarea>
     <div class="modal-radio-group">
       <label><input type="radio" name="qsdir" value="qs-to-json" checked /> ${tr('btn_query_json')}</label>
       <label><input type="radio" name="qsdir" value="json-to-qs" /> ${tr('btn_json_query')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast(tr('enter_data')); return; }
    const dir = (document.querySelector('input[name="qsdir"]:checked') as HTMLInputElement).value;
    try {
      const result = dir === 'qs-to-json' ? queryStringToJson(v) : jsonToQueryString(v);
      editor.set({ json: result });
      closeModal(); showToast(tr('converted'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// ========== Language ==========
const chipMap: Record<string, LangKey> = {
  'btn-json': 'chip_json', 'btn-jwt-header': 'chip_jwt', 'btn-base64': 'chip_base64',
  'btn-url': 'chip_url', 'btn-timestamp': 'chip_timestamp', 'btn-uuid': 'chip_uuid',
  'btn-yaml': 'chip_yaml', 'btn-schema': 'chip_schema', 'btn-hash': 'chip_hash',
  'btn-regex': 'chip_regex', 'btn-color': 'chip_color', 'btn-diff': 'chip_diff',
  'btn-mock': 'chip_mock', 'btn-cron': 'chip_cron', 'btn-password': 'chip_password',
  'btn-lorem': 'chip_lorem', 'btn-numbase': 'chip_base', 'btn-casecvt': 'chip_case',
  'btn-htmlent': 'chip_entity', 'btn-strescape': 'chip_escape', 'btn-querystr': 'chip_query',
};

const toolbarMap: Record<string, { label: LangKey; tip: LangKey }> = {
  'btn-format': { label: 'format', tip: 'tip_format' },
  'btn-compact': { label: 'minify', tip: 'tip_minify' },
  'btn-copy': { label: 'copy', tip: 'tip_copy' },
  'btn-paste': { label: 'paste', tip: 'tip_paste' },
  'btn-upload': { label: 'open', tip: 'tip_upload' },
  'btn-download': { label: 'save', tip: 'tip_download' },
  'btn-sample': { label: 'sample', tip: 'tip_sample' },
  'btn-clear': { label: 'clear', tip: 'tip_clear' },
};

function applyLanguage() {
  document.getElementById('lang-switch')!.textContent = lang.toUpperCase();
  // Tool chips
  for (const [id, key] of Object.entries(chipMap)) {
    const span = document.getElementById(id)?.querySelector('span');
    if (span) span.textContent = tr(key);
  }
  // Toolbar buttons
  for (const [id, keys] of Object.entries(toolbarMap)) {
    const btn = document.getElementById(id);
    if (!btn) continue;
    const label = btn.querySelector('.btn-label');
    if (label) label.textContent = tr(keys.label);
    btn.setAttribute('data-tooltip', tr(keys.tip));
  }
  // Footer
  const ft = document.getElementById('footer-tools');
  if (ft) ft.textContent = tr('20_tools');
  const fb = document.getElementById('footer-browser');
  if (fb) fb.textContent = tr('runs_in_browser');
  const fv = document.getElementById('footer-visits');
  if (fv) fv.textContent = tr('visits');
  // Modal cancel
  document.getElementById('modal-cancel')!.textContent = tr('btn_cancel');
}

applyLanguage();

document.getElementById('lang-switch')!.addEventListener('click', () => {
  lang = lang === 'en' ? 'ru' : 'en';
  localStorage.setItem('devtools-lang', lang);
  applyLanguage();
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