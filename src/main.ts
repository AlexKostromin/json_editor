import { createJSONEditor, type JSONEditorPropsOptional } from 'vanilla-jsoneditor';
import {
  base64Encode, base64Decode, urlEncode, urlDecode,
  timestampToDate, dateToTimestamp, generateUUIDs, decodeJwt,
  jsonToYaml, yamlToJson, generateJsonSchema, generateHashes,
  testRegex, convertColor, jsonDiff, generateMockUsers,
  parseCron, generatePasswords, generateLoremIpsum, convertNumberBase,
  convertCase, htmlEntityEncode, htmlEntityDecode, escapeString, unescapeString,
  queryStringToJson, jsonToQueryString,
  csvToJson, jsonToCsv, jsonToTypeScript, textDiff,
} from './tools';
import './style.css';

// ========== i18n ==========
const t = {
  en: {
    // Header/Footer
    '20_tools': '23 tools',
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
    'chip_numbase': 'Base',
    'chip_case': 'Case',
    'chip_entity': 'Entity',
    'chip_escape': 'Escape',
    'chip_query': 'Query',
    'chip_csv': 'CSV',
    'chip_ts': 'TS Types',
    'chip_textdiff': 'TextDiff',
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
    'csv_to_json_done': 'CSV converted to JSON',
    'json_to_csv_done': 'JSON converted to CSV',
    'csv_error': 'CSV parsing error',
    'ts_generated': 'TypeScript interfaces generated',
    'text_diff_done': 'Text comparison complete',
    'enter_root_name': 'Root interface name:',
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
    'title_csv': 'CSV ↔ JSON Converter',
    'title_ts': 'JSON → TypeScript Interfaces',
    'title_textdiff': 'Text Diff — Compare Two Texts',
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
    'ph_csv': 'Paste CSV data with headers...',
    'ph_csv_json': 'Paste JSON array...',
    'ph_ts': 'Paste JSON to generate TypeScript interfaces...',
    'ph_textdiff1': 'First text...',
    'ph_textdiff2': 'Second text...',
    'ph_delimiter': 'Delimiter:',
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
    'btn_csv_to_json': 'CSV → JSON',
    'btn_json_to_csv': 'JSON → CSV',
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
    '20_tools': '23 инструмента',
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
    'chip_numbase': 'Базис',
    'chip_case': 'Регистр',
    'chip_entity': 'Сущн.',
    'chip_escape': 'Экран.',
    'chip_query': 'Запрос',
    'chip_csv': 'CSV',
    'chip_ts': 'TS Типы',
    'chip_textdiff': 'ТекстДифф',
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
    'csv_to_json_done': 'CSV конвертирован в JSON',
    'json_to_csv_done': 'JSON конвертирован в CSV',
    'csv_error': 'Ошибка парсинга CSV',
    'ts_generated': 'TypeScript интерфейсы сгенерированы',
    'text_diff_done': 'Сравнение текста завершено',
    'enter_root_name': 'Имя корневого интерфейса:',
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
    'title_csv': 'CSV ↔ JSON Конвертер',
    'title_ts': 'JSON → TypeScript Интерфейсы',
    'title_textdiff': 'Сравнение двух текстов',
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
    'ph_csv': 'Вставьте CSV данные с заголовками...',
    'ph_csv_json': 'Вставьте JSON массив...',
    'ph_ts': 'Вставьте JSON для генерации TypeScript интерфейсов...',
    'ph_textdiff1': 'Первый текст...',
    'ph_textdiff2': 'Второй текст...',
    'ph_delimiter': 'Разделитель:',
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
    'btn_csv_to_json': 'CSV → JSON',
    'btn_json_to_csv': 'JSON → CSV',
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

// ========== Tools Grid (Home Screen) ==========
const toolsHome = document.createElement('div');
toolsHome.className = 'tools-home';
const toolsGrid = document.createElement('div');
toolsGrid.className = 'tools-grid';
const toolCards = [
  { id: 'btn-json', icon: '{ }', cls: 'json', label: 'JSON' },
  { id: 'btn-jwt-header', icon: icons.jwt, cls: 'jwt', label: 'JWT' },
  { id: 'btn-base64', icon: 'B64', cls: 'base64', label: 'Base64' },
  { id: 'btn-url', icon: '%', cls: 'url', label: 'URL' },
  { id: 'btn-timestamp', icon: '⏱', cls: 'timestamp', label: 'Timestamp' },
  { id: 'btn-uuid', icon: 'ID', cls: 'uuid', label: 'UUID' },
  { id: 'btn-yaml', icon: 'YML', cls: 'yaml', label: 'YAML' },
  { id: 'btn-schema', icon: '{ }', cls: 'schema', label: 'Schema' },
  { id: 'btn-hash', icon: '#', cls: 'hash', label: 'Hash' },
  { id: 'btn-regex', icon: '.*', cls: 'regex', label: 'Regex' },
  { id: 'btn-color', icon: '●', cls: 'color', label: 'Color' },
  { id: 'btn-diff', icon: '≠', cls: 'diff', label: 'JSON Diff' },
  { id: 'btn-mock', icon: '⊞', cls: 'mock', label: 'Mock Data' },
  { id: 'btn-cron', icon: '⏲', cls: 'cron', label: 'Cron' },
  { id: 'btn-password', icon: '🔑', cls: 'password', label: 'Password' },
  { id: 'btn-lorem', icon: 'Aa', cls: 'lorem', label: 'Lorem Ipsum' },
  { id: 'btn-numbase', icon: '0x', cls: 'numbase', label: 'Num Base' },
  { id: 'btn-casecvt', icon: 'Aa', cls: 'casecvt', label: 'Case' },
  { id: 'btn-htmlent', icon: '&amp;', cls: 'htmlent', label: 'HTML Entity' },
  { id: 'btn-strescape', icon: '\\n', cls: 'strescape', label: 'Escape' },
  { id: 'btn-querystr', icon: '?=', cls: 'querystr', label: 'Query String' },
  { id: 'btn-csv', icon: '📊', cls: 'csv', label: 'CSV' },
  { id: 'btn-ts', icon: 'TS', cls: 'ts', label: 'TypeScript' },
  { id: 'btn-textdiff', icon: '≈', cls: 'textdiff', label: 'Text Diff' },
];
toolsGrid.innerHTML = toolCards.map(c =>
  `<button class="tool-card ${c.cls}" id="${c.id}"><span class="tool-card-icon">${c.icon}</span><span class="tool-card-label">${c.label}</span></button>`
).join('');
toolsHome.innerHTML = `<h1 class="tools-title">DevTools Online</h1><p class="tools-subtitle">24 developer tools — right in your browser</p>`;
toolsHome.appendChild(toolsGrid);
app.appendChild(toolsHome);

// ========== Toolbar ==========
const toolbar = document.createElement('div');
toolbar.className = 'toolbar';
toolbar.innerHTML = `
  <button class="btn home-btn" id="btn-home">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    <span class="btn-label">Home</span>
  </button>
  <div class="divider"></div>
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

function closeModal(goHome = true) {
  modal.classList.remove('show');
  currentModalHandler = null;
  if (goHome) showHome(); else showEditor();
}

document.getElementById('modal-cancel')!.addEventListener('click', () => closeModal());
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
editorWrapper.style.display = 'none';
app.appendChild(editorWrapper);

// Initially hide toolbar
toolbar.style.display = 'none';

// ========== View Toggle ==========
function showHome() {
  toolsHome.style.display = '';
  toolbar.style.display = 'none';
  editorWrapper.style.display = 'none';
}

function showEditor() {
  toolsHome.style.display = 'none';
  toolbar.style.display = '';
  editorWrapper.style.display = '';
}

document.getElementById('btn-home')!.addEventListener('click', showHome);

// Click on logo → go home
document.querySelector('.header-left')!.addEventListener('click', showHome);
(document.querySelector('.header-left') as HTMLElement).style.cursor = 'pointer';

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
  showEditor();
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
    try { editor.set({ json: decodeJwt(v) }); closeModal(false); showToast(tr('jwt_decoded')); }
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
      closeModal(false); showToast(dir === 'encode' ? tr('base64_encoded') : tr('base64_decoded'));
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
      closeModal(false); showToast(dir === 'encode' ? tr('url_encoded') : tr('url_decoded'));
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
      closeModal(false); showToast(v ? tr('timestamp_converted') : tr('current_time'));
    } catch { showToast(tr('invalid_timestamp')); }
  });
});

// UUID
document.getElementById('btn-uuid')!.addEventListener('click', () => {
  showEditor();
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
        closeModal(false); showToast(tr('converted_yaml'));
      } else {
        const jsonStr = yamlToJson(v);
        editor.set({ json: JSON.parse(jsonStr) });
        closeModal(false); showToast(tr('converted_json'));
      }
    } catch { showToast(tr('conversion_error')); }
  });
});

// JSON Schema
document.getElementById('btn-schema')!.addEventListener('click', () => {
  showEditor();
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
      closeModal(false); showToast(tr('hashes_generated'));
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
      closeModal(false); showToast(tr('regex_tested'));
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
      closeModal(false); showToast(tr('color_converted'));
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
      closeModal(false); showToast(tr('comparison_complete'));
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
    closeModal(false); showToast(`${count} ${tr('records_generated')}`);
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
      closeModal(false); showToast(tr('cron_parsed'));
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
      closeModal(false); showToast(tr('passwords_generated'));
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
    closeModal(false); showToast(tr('lorem_generated'));
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
      closeModal(false); showToast(tr('number_converted'));
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
    closeModal(false); showToast(tr('case_converted'));
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
    closeModal(false); showToast(dir === 'encode' ? tr('html_encoded') : tr('html_decoded'));
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
    closeModal(false); showToast(dir === 'escape' ? tr('string_escaped') : tr('string_unescaped'));
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
      closeModal(false); showToast(tr('converted'));
    } catch (e) { showToast(e instanceof Error ? e.message : 'Error'); }
  });
});

// CSV ↔ JSON
document.getElementById('btn-csv')!.addEventListener('click', () => {
  openModal(tr('title_csv'),
    `<textarea id="tool-input" placeholder="${tr('ph_csv')}" rows="6"></textarea>
     <div class="modal-field-group" style="margin-top:10px">
       <label style="color:#94a3b8;font-size:13px">${tr('ph_delimiter')}</label>
       <input id="csv-delim" type="text" value="," style="width:60px" />
     </div>
     <div class="modal-radio-group">
       <label><input type="radio" name="csvdir" value="csv-to-json" checked /> ${tr('btn_csv_to_json')}</label>
       <label><input type="radio" name="csvdir" value="json-to-csv" /> ${tr('btn_json_to_csv')}</label>
     </div>`, tr('btn_convert'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value;
    if (!v.trim()) { showToast(tr('enter_data')); return; }
    const delim = (document.getElementById('csv-delim') as HTMLInputElement).value || ',';
    const dir = (document.querySelector('input[name="csvdir"]:checked') as HTMLInputElement).value;
    try {
      if (dir === 'csv-to-json') {
        editor.set({ json: csvToJson(v, delim) });
        closeModal(false); showToast(tr('csv_to_json_done'));
      } else {
        const result = jsonToCsv(v, delim);
        editor.set({ text: result.csv });
        closeModal(false); showToast(tr('json_to_csv_done'));
      }
    } catch (e) { showToast(e instanceof Error ? e.message : tr('csv_error')); }
  });
});

// JSON → TypeScript
document.getElementById('btn-ts')!.addEventListener('click', () => {
  openModal(tr('title_ts'),
    `<textarea id="tool-input" placeholder="${tr('ph_ts')}" rows="6"></textarea>
     <div class="modal-field-group" style="margin-top:10px">
       <label style="color:#94a3b8;font-size:13px">${tr('enter_root_name')}</label>
       <input id="ts-root" type="text" value="Root" style="width:120px" />
     </div>`,
    tr('btn_generate'), () => {
    const v = (document.getElementById('tool-input') as HTMLTextAreaElement).value.trim();
    if (!v) { showToast(tr('enter_data')); return; }
    const rootName = (document.getElementById('ts-root') as HTMLInputElement).value.trim() || 'Root';
    try {
      const result = jsonToTypeScript(v, rootName);
      editor.set({ text: result.typescript });
      closeModal(false); showToast(tr('ts_generated'));
    } catch (e) { showToast(e instanceof Error ? e.message : tr('error_invalid_json')); }
  });
});

// Text Diff
document.getElementById('btn-textdiff')!.addEventListener('click', () => {
  openModal(tr('title_textdiff'),
    `<textarea id="diff-text-1" placeholder="${tr('ph_textdiff1')}" rows="4"></textarea>
     <textarea id="diff-text-2" placeholder="${tr('ph_textdiff2')}" rows="4" style="margin-top:8px"></textarea>`,
    tr('btn_compare'), () => {
    const v1 = (document.getElementById('diff-text-1') as HTMLTextAreaElement).value;
    const v2 = (document.getElementById('diff-text-2') as HTMLTextAreaElement).value;
    if (!v1 || !v2) { showToast(tr('fill_both')); return; }
    editor.set({ json: textDiff(v1, v2) });
    closeModal(false); showToast(tr('text_diff_done'));
  });
});

// ========== Language ==========
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