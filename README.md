# JSON Editor & Dev Tools Online

**[https://alexkostromin.github.io/json_editor/](https://alexkostromin.github.io/json_editor/)**

Бесплатные онлайн инструменты для разработчика. Всё работает прямо в браузере — данные никуда не отправляются.

## Инструменты

- **JSON Editor** — редактирование, форматирование, валидация JSON. Режимы: tree, text, table
- **JWT Decoder** — декодирование JWT токенов (header + payload), автоматическое преобразование дат
- **Base64 Encode/Decode** — кодирование и декодирование Base64 с поддержкой кириллицы
- **URL Encode/Decode** — кодирование и декодирование URL-строк
- **Unix Timestamp** — конвертация Unix timestamp в дату и обратно
- **UUID Generator** — генерация UUID v4

## Технологии

- [Vite](https://vitejs.dev/) — сборка
- [vanilla-jsoneditor](https://github.com/josdejong/svelte-jsoneditor) — JSON редактор
- TypeScript
- GitHub Pages — хостинг

## Запуск локально

```bash
npm install
npm run dev
```

## Лицензия

MIT