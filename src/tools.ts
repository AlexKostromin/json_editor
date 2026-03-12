import yaml from 'js-yaml';

// ========== Base64 ==========
export function base64Encode(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function base64Decode(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}

// ========== URL encode/decode ==========
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

// ========== Unix Timestamp ==========
export function timestampToDate(ts: string): string {
  const num = Number(ts.trim());
  if (isNaN(num)) throw new Error('Invalid timestamp');
  const ms = num > 1e12 ? num : num * 1000;
  const d = new Date(ms);
  return JSON.stringify({
    utc: d.toUTCString(),
    local: d.toLocaleString('en-US'),
    iso: d.toISOString(),
    timestamp_sec: Math.floor(ms / 1000),
    timestamp_ms: ms,
  }, null, 2);
}

export function dateToTimestamp(): string {
  const now = new Date();
  return JSON.stringify({
    now_utc: now.toUTCString(),
    now_local: now.toLocaleString('en-US'),
    now_iso: now.toISOString(),
    timestamp_sec: Math.floor(now.getTime() / 1000),
    timestamp_ms: now.getTime(),
  }, null, 2);
}

// ========== UUID ==========
export function generateUUIDs(count: number = 5): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }
  return uuids;
}

// ========== JWT ==========
export function decodeJwt(token: string): { header: Record<string, unknown>; payload: Record<string, unknown>; signature: string } {
  const parts = token.trim().split('.');
  if (parts.length !== 3) throw new Error('Invalid JWT: must have 3 parts');

  const decodeBase64 = (part: string) => {
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    return JSON.parse(atob(padded));
  };

  const header = decodeBase64(parts[0]);
  const payload = decodeBase64(parts[1]);

  const timeFields = ['exp', 'iat', 'nbf'];
  for (const field of timeFields) {
    if (typeof payload[field] === 'number') {
      payload[`${field}_readable`] = new Date(payload[field] * 1000).toLocaleString('en-US');
    }
  }

  return { header, payload, signature: parts[2] };
}

// ========== YAML <-> JSON ==========
export function jsonToYaml(jsonStr: string): string {
  const obj = JSON.parse(jsonStr);
  return yaml.dump(obj, { indent: 2, lineWidth: 120 });
}

export function yamlToJson(yamlStr: string): string {
  const obj = yaml.load(yamlStr);
  return JSON.stringify(obj, null, 2);
}

// ========== JSON Schema Generator ==========
function inferType(value: unknown): Record<string, unknown> {
  if (value === null) return { type: 'null' };
  if (Array.isArray(value)) {
    const schema: Record<string, unknown> = { type: 'array' };
    if (value.length > 0) {
      schema.items = inferType(value[0]);
    }
    return schema;
  }
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];
    for (const [k, v] of Object.entries(obj)) {
      properties[k] = inferType(v);
      required.push(k);
    }
    return { type: 'object', properties, required };
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? { type: 'integer' } : { type: 'number' };
  }
  if (typeof value === 'boolean') return { type: 'boolean' };
  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}(T|\s)/.test(value)) return { type: 'string', format: 'date-time' };
    if (/^[^@]+@[^@]+\.[^@]+$/.test(value)) return { type: 'string', format: 'email' };
    if (/^https?:\/\//.test(value)) return { type: 'string', format: 'uri' };
    return { type: 'string' };
  }
  return {};
}

export function generateJsonSchema(jsonStr: string): Record<string, unknown> {
  const obj = JSON.parse(jsonStr);
  const schema = inferType(obj);
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    ...schema,
  };
}

// ========== Hash Generator ==========
async function hashWith(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHashes(text: string): Promise<Record<string, string>> {
  const [sha256, sha1, sha384, sha512] = await Promise.all([
    hashWith('SHA-256', text),
    hashWith('SHA-1', text),
    hashWith('SHA-384', text),
    hashWith('SHA-512', text),
  ]);
  return {
    input: text,
    sha256,
    sha1,
    sha384,
    sha512,
    length: `${text.length} chars`,
  };
}

// ========== Regex Tester ==========
export function testRegex(pattern: string, flags: string, testString: string): Record<string, unknown> {
  const regex = new RegExp(pattern, flags);
  const matches: Record<string, unknown>[] = [];

  if (flags.includes('g')) {
    let match;
    while ((match = regex.exec(testString)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).length > 0 ? match.slice(1) : undefined,
      });
      if (!match[0]) break; // prevent infinite loop on zero-length match
    }
  } else {
    const match = regex.exec(testString);
    if (match) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1).length > 0 ? match.slice(1) : undefined,
      });
    }
  }

  return {
    pattern,
    flags,
    test_string: testString,
    is_match: matches.length > 0,
    match_count: matches.length,
    matches,
  };
}

// ========== Color Converter ==========
export function convertColor(input: string): Record<string, string> {
  let r: number, g: number, b: number;

  const hexMatch = input.trim().match(/^#?([0-9a-f]{3,8})$/i);
  const rgbMatch = input.trim().match(/^rgb\w?\((\d+),\s*(\d+),\s*(\d+)/);
  const hslMatch = input.trim().match(/^hsl\w?\((\d+),\s*(\d+)%?,\s*(\d+)%?/);

  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else if (rgbMatch) {
    r = parseInt(rgbMatch[1]);
    g = parseInt(rgbMatch[2]);
    b = parseInt(rgbMatch[3]);
  } else if (hslMatch) {
    const h = parseInt(hslMatch[1]) / 360;
    const s = parseInt(hslMatch[2]) / 100;
    const l = parseInt(hslMatch[3]) / 100;
    if (s === 0) {
      r = g = b = Math.round(l * 255);
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
      g = Math.round(hue2rgb(p, q, h) * 255);
      b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
    }
  } else {
    throw new Error('Unknown format. Use HEX (#ff0000), RGB (rgb(255,0,0)) or HSL (hsl(0,100%,50%))');
  }

  // RGB -> HSL
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }

  const hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');

  return {
    input: input.trim(),
    hex: hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
    r: String(r),
    g: String(g),
    b: String(b),
  };
}

// ========== JSON Diff ==========
export function jsonDiff(json1Str: string, json2Str: string): Record<string, unknown> {
  const obj1 = JSON.parse(json1Str);
  const obj2 = JSON.parse(json2Str);

  function diff(a: unknown, b: unknown, path: string = ''): Record<string, unknown>[] {
    const changes: Record<string, unknown>[] = [];

    if (a === b) return changes;

    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object' || typeof b !== 'object') {
      changes.push({ path: path || '(root)', type: 'changed', from: a, to: b });
      return changes;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      const maxLen = Math.max(a.length, b.length);
      for (let i = 0; i < maxLen; i++) {
        const p = `${path}[${i}]`;
        if (i >= a.length) {
          changes.push({ path: p, type: 'added', value: b[i] });
        } else if (i >= b.length) {
          changes.push({ path: p, type: 'removed', value: a[i] });
        } else {
          changes.push(...diff(a[i], b[i], p));
        }
      }
      return changes;
    }

    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)]);

    for (const key of allKeys) {
      const p = path ? `${path}.${key}` : key;
      if (!(key in aObj)) {
        changes.push({ path: p, type: 'added', value: bObj[key] });
      } else if (!(key in bObj)) {
        changes.push({ path: p, type: 'removed', value: aObj[key] });
      } else {
        changes.push(...diff(aObj[key], bObj[key], p));
      }
    }

    return changes;
  }

  const changes = diff(obj1, obj2);

  return {
    total_changes: changes.length,
    identical: changes.length === 0,
    added: changes.filter(c => c.type === 'added').length,
    removed: changes.filter(c => c.type === 'removed').length,
    changed: changes.filter(c => c.type === 'changed').length,
    changes,
  };
}

// ========== Cron Parser ==========
const CRON_MONTHS = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const CRON_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function describeCronField(field: string, unit: string, names?: string[]): string {
  if (field === '*') return `every ${unit}`;
  if (field.includes('/')) {
    const [base, step] = field.split('/');
    return base === '*' || base === '0' ? `every ${step} ${unit}s` : `every ${step} ${unit}s starting at ${unit} ${base}`;
  }
  if (field.includes('-')) {
    const [from, to] = field.split('-');
    const fromName = names ? names[parseInt(from)] || from : from;
    const toName = names ? names[parseInt(to)] || to : to;
    return `${fromName} through ${toName}`;
  }
  if (field.includes(',')) {
    const parts = field.split(',').map(p => names ? names[parseInt(p)] || p : p);
    return `at ${unit} ${parts.join(', ')}`;
  }
  return names ? (names[parseInt(field)] || field) : `${unit} ${field}`;
}

export function parseCron(expression: string): Record<string, unknown> {
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5 || parts.length > 6) throw new Error('Invalid cron: expected 5 or 6 fields (minute hour day month weekday)');

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

  const descriptions: string[] = [];

  if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    descriptions.push('Every minute');
  } else if (minute !== '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
    descriptions.push(describeCronField(minute, 'minute'));
  } else {
    if (minute !== '*') descriptions.push(describeCronField(minute, 'minute'));
    if (hour !== '*') descriptions.push(describeCronField(hour, 'hour'));
    if (dayOfMonth !== '*') descriptions.push(describeCronField(dayOfMonth, 'day'));
    if (month !== '*') descriptions.push(describeCronField(month, 'month', CRON_MONTHS));
    if (dayOfWeek !== '*') descriptions.push(describeCronField(dayOfWeek, 'weekday', CRON_DAYS));
  }

  // Calculate next 5 runs
  const nextRuns: string[] = [];
  const now = new Date();
  const candidate = new Date(now);
  candidate.setSeconds(0, 0);

  for (let attempts = 0; attempts < 10000 && nextRuns.length < 5; attempts++) {
    candidate.setMinutes(candidate.getMinutes() + 1);
    const m = candidate.getMinutes(), h = candidate.getHours();
    const dom = candidate.getDate(), mon = candidate.getMonth() + 1, dow = candidate.getDay();

    if (!matchesCronField(minute, m)) continue;
    if (!matchesCronField(hour, h)) continue;
    if (!matchesCronField(dayOfMonth, dom)) continue;
    if (!matchesCronField(month, mon)) continue;
    if (!matchesCronField(dayOfWeek, dow)) continue;

    nextRuns.push(candidate.toLocaleString('en-US'));
  }

  return {
    expression: expression.trim(),
    fields: { minute, hour, day_of_month: dayOfMonth, month, day_of_week: dayOfWeek },
    description: descriptions.join(', '),
    next_5_runs: nextRuns,
  };
}

function matchesCronField(field: string, value: number): boolean {
  if (field === '*') return true;
  if (field.includes('/')) {
    const [base, step] = field.split('/');
    const start = base === '*' ? 0 : parseInt(base);
    return (value - start) % parseInt(step) === 0 && value >= start;
  }
  if (field.includes(',')) return field.split(',').map(Number).includes(value);
  if (field.includes('-')) {
    const [from, to] = field.split('-').map(Number);
    return value >= from && value <= to;
  }
  return parseInt(field) === value;
}

// ========== Password Generator ==========
export function generatePasswords(length: number, count: number, options: { uppercase: boolean; lowercase: boolean; numbers: boolean; symbols: boolean }): Record<string, unknown> {
  let chars = '';
  if (options.lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
  if (options.uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (options.numbers) chars += '0123456789';
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  if (!chars) throw new Error('Select at least one character type');

  const passwords: string[] = [];
  const array = new Uint32Array(length);
  for (let i = 0; i < count; i++) {
    crypto.getRandomValues(array);
    let pw = '';
    for (let j = 0; j < length; j++) {
      pw += chars[array[j] % chars.length];
    }
    passwords.push(pw);
  }

  const entropy = Math.floor(length * Math.log2(chars.length));

  return {
    passwords,
    count,
    length,
    character_set_size: chars.length,
    entropy_bits: entropy,
    strength: entropy < 40 ? 'Weak' : entropy < 60 ? 'Fair' : entropy < 80 ? 'Strong' : 'Very Strong',
  };
}

// ========== Lorem Ipsum Generator ==========
const LOREM_WORDS = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'semper', 'ligula', 'nec', 'volutpat', 'maecenas', 'viverra', 'condimentum', 'pharetra', 'vestibulum', 'faucibus', 'orci', 'luctus', 'ultrices', 'posuere', 'cubilia', 'curae', 'donec', 'velit', 'justo', 'fringilla'];

function generateLoremSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words: string[] = [];
  for (let i = 0; i < len; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

function generateLoremParagraph(): string {
  const count = 4 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < count; i++) sentences.push(generateLoremSentence());
  return sentences.join(' ');
}

export function generateLoremIpsum(mode: 'words' | 'sentences' | 'paragraphs', count: number): Record<string, unknown> {
  let result: string;
  if (mode === 'words') {
    const words: string[] = [];
    for (let i = 0; i < count; i++) words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    result = words.join(' ') + '.';
  } else if (mode === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) sentences.push(generateLoremSentence());
    result = sentences.join(' ');
  } else {
    const paragraphs: string[] = [];
    for (let i = 0; i < count; i++) paragraphs.push(generateLoremParagraph());
    result = paragraphs.join('\n\n');
  }
  return { mode, count, text: result, character_count: result.length, word_count: result.split(/\s+/).length };
}

// ========== Number Base Converter ==========
export function convertNumberBase(input: string, fromBase: number): Record<string, unknown> {
  const cleaned = input.trim().replace(/^0[xXbBoO]/, '');
  const decimal = parseInt(cleaned, fromBase);
  if (isNaN(decimal)) throw new Error(`Invalid number for base ${fromBase}`);

  return {
    input,
    from_base: fromBase,
    decimal: decimal,
    binary: '0b' + decimal.toString(2),
    octal: '0o' + decimal.toString(8),
    hexadecimal: '0x' + decimal.toString(16).toUpperCase(),
    binary_raw: decimal.toString(2),
    octal_raw: decimal.toString(8),
    hex_raw: decimal.toString(16).toUpperCase(),
  };
}

// ========== Case Converter ==========
export function convertCase(input: string): Record<string, string> {
  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

  const lower = words.map(w => w.toLowerCase());

  return {
    input,
    camelCase: lower[0] + lower.slice(1).map(w => w[0].toUpperCase() + w.slice(1)).join(''),
    PascalCase: lower.map(w => w[0].toUpperCase() + w.slice(1)).join(''),
    snake_case: lower.join('_'),
    SCREAMING_SNAKE_CASE: lower.map(w => w.toUpperCase()).join('_'),
    'kebab-case': lower.join('-'),
    'SCREAMING-KEBAB-CASE': lower.map(w => w.toUpperCase()).join('-'),
    'Title Case': lower.map(w => w[0].toUpperCase() + w.slice(1)).join(' '),
    lowercase: lower.join(' '),
    UPPERCASE: lower.map(w => w.toUpperCase()).join(' '),
    'dot.case': lower.join('.'),
  };
}

// ========== HTML Entity Encode/Decode ==========
const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  '\u00a0': '&nbsp;', '\u00a9': '&copy;', '\u00ae': '&reg;', '\u2122': '&trade;',
  '\u2013': '&ndash;', '\u2014': '&mdash;', '\u2018': '&lsquo;', '\u2019': '&rsquo;',
  '\u201c': '&ldquo;', '\u201d': '&rdquo;', '\u2026': '&hellip;', '\u00b7': '&middot;',
};

const HTML_DECODE_MAP: Record<string, string> = {};
for (const [char, entity] of Object.entries(HTML_ENTITIES)) {
  HTML_DECODE_MAP[entity] = char;
}

export function htmlEntityEncode(input: string): string {
  return input.replace(/[&<>"'\u00a0\u00a9\u00ae\u2122\u2013\u2014\u2018\u2019\u201c\u201d\u2026\u00b7]/g, ch => HTML_ENTITIES[ch] || ch);
}

export function htmlEntityDecode(input: string): string {
  return input
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp|copy|reg|trade|ndash|mdash|lsquo|rsquo|ldquo|rdquo|hellip|middot);/g, entity => HTML_DECODE_MAP[entity] || entity)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

// ========== String Escape/Unescape ==========
export function escapeString(input: string): Record<string, string> {
  return {
    input,
    json: JSON.stringify(input),
    javascript: input.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t'),
    html: input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'),
    url: encodeURIComponent(input),
    csv: `"${input.replace(/"/g, '""')}"`,
  };
}

export function unescapeString(input: string): Record<string, string> {
  let jsonResult = input;
  try { jsonResult = JSON.parse(input); } catch { /* not valid JSON string */ }

  const jsResult = input.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');

  return {
    input,
    json_unescaped: jsonResult,
    js_unescaped: jsResult,
    html_unescaped: input.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
    url_decoded: decodeURIComponent(input.replace(/\+/g, ' ')),
  };
}

// ========== Query String ↔ JSON ==========
export function queryStringToJson(qs: string): Record<string, unknown> {
  const cleaned = qs.trim().replace(/^\?/, '');
  const params: Record<string, string | string[]> = {};
  for (const pair of cleaned.split('&')) {
    if (!pair) continue;
    const [key, ...rest] = pair.split('=');
    const decodedKey = decodeURIComponent(key);
    const decodedValue = decodeURIComponent(rest.join('='));
    if (decodedKey in params) {
      const existing = params[decodedKey];
      if (Array.isArray(existing)) existing.push(decodedValue);
      else params[decodedKey] = [existing, decodedValue];
    } else {
      params[decodedKey] = decodedValue;
    }
  }
  return { query_string: qs.trim(), json: params, param_count: Object.keys(params).length };
}

export function jsonToQueryString(jsonStr: string): Record<string, string> {
  const obj = JSON.parse(jsonStr);
  const parts: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      for (const v of value) parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }
  const qs = parts.join('&');
  return { json: jsonStr, query_string: qs, full_url_example: `https://example.com/?${qs}` };
}

// ========== CSV ↔ JSON ==========
function parseCSVLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

export function csvToJson(csv: string, delimiter: string = ','): Record<string, unknown> {
  const lines = csv.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) throw new Error('CSV must have header + at least 1 row');
  const headers = parseCSVLine(lines[0], delimiter);
  const rows = lines.slice(1).map(line => {
    const values = parseCSVLine(line, delimiter);
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => { obj[h.trim()] = (values[i] || '').trim(); });
    return obj;
  });
  return { rows, row_count: rows.length, columns: headers.map(h => h.trim()), column_count: headers.length };
}

export function jsonToCsv(jsonStr: string, delimiter: string = ','): Record<string, string> {
  const data = JSON.parse(jsonStr);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) throw new Error('Empty array');
  const headers = Object.keys(arr[0]);
  const escapeField = (val: unknown): string => {
    const str = String(val ?? '');
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.join(delimiter)];
  for (const row of arr) {
    lines.push(headers.map(h => escapeField((row as Record<string, unknown>)[h])).join(delimiter));
  }
  const csv = lines.join('\n');
  return { csv, row_count: String(arr.length), column_count: String(headers.length) };
}

// ========== JSON to TypeScript ==========
export function jsonToTypeScript(jsonStr: string, rootName: string = 'Root'): Record<string, string> {
  const data = JSON.parse(jsonStr);
  const interfaces: string[] = [];
  const generated = new Set<string>();

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function sanitizeName(s: string): string {
    return s.replace(/[^a-zA-Z0-9_]/g, '_');
  }

  function inferType(value: unknown, name: string): string {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return Number.isInteger(value) ? 'number' : 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) {
      if (value.length === 0) return 'unknown[]';
      const itemType = inferType(value[0], name + 'Item');
      return `${itemType}[]`;
    }
    if (typeof value === 'object') {
      const interfaceName = capitalize(sanitizeName(name));
      generateInterface(value as Record<string, unknown>, interfaceName);
      return interfaceName;
    }
    return 'unknown';
  }

  function generateInterface(obj: Record<string, unknown>, name: string): void {
    if (generated.has(name)) return;
    generated.add(name);
    const lines = [`export interface ${name} {`];
    for (const [key, value] of Object.entries(obj)) {
      const safeName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
      const type = inferType(value, key);
      lines.push(`  ${safeName}: ${type};`);
    }
    lines.push('}');
    interfaces.push(lines.join('\n'));
  }

  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
      generateInterface(data[0] as Record<string, unknown>, rootName);
      interfaces.unshift(`export type ${rootName}List = ${rootName}[];`);
    } else {
      const itemType = data.length > 0 ? inferType(data[0], 'Item') : 'unknown';
      interfaces.push(`export type ${rootName} = ${itemType}[];`);
    }
  } else if (typeof data === 'object' && data !== null) {
    generateInterface(data as Record<string, unknown>, rootName);
  } else {
    interfaces.push(`export type ${rootName} = ${typeof data};`);
  }

  const typescript = interfaces.join('\n\n');
  return { typescript, interface_count: String(generated.size || 1) };
}

// ========== Text Diff ==========
function lcsMatrix(a: string[], b: string[]): number[][] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

export function textDiff(text1: string, text2: string): Record<string, unknown> {
  const lines1 = text1.split(/\r?\n/);
  const lines2 = text2.split(/\r?\n/);
  const dp = lcsMatrix(lines1, lines2);

  const changes: Record<string, unknown>[] = [];
  let i = lines1.length, j = lines2.length;
  const result: { type: string; line: string; lineNum1?: number; lineNum2?: number }[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      result.unshift({ type: 'equal', line: lines1[i - 1], lineNum1: i, lineNum2: j });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', line: lines2[j - 1], lineNum2: j });
      j--;
    } else if (i > 0) {
      result.unshift({ type: 'removed', line: lines1[i - 1], lineNum1: i });
      i--;
    }
  }

  for (const r of result) {
    if (r.type !== 'equal') {
      changes.push(r);
    }
  }

  const added = changes.filter(c => c.type === 'added').length;
  const removed = changes.filter(c => c.type === 'removed').length;

  return {
    total_changes: changes.length,
    identical: changes.length === 0,
    lines_added: added,
    lines_removed: removed,
    text1_lines: lines1.length,
    text2_lines: lines2.length,
    diff: result.map(r => {
      const prefix = r.type === 'added' ? '+ ' : r.type === 'removed' ? '- ' : '  ';
      return prefix + r.line;
    }).join('\n'),
    changes,
  };
}

// ========== Mock Data Generator ==========
const firstNames = ['James', 'Mary', 'John', 'Sarah', 'Robert', 'Emma', 'Michael', 'Olivia', 'William', 'Emily', 'David', 'Jessica', 'Daniel', 'Sophie', 'Thomas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'proton.me', 'icloud.com'];
const cities = ['New York', 'London', 'San Francisco', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Amsterdam', 'Singapore', 'Paris'];
const companies = ['Acme Corp', 'TechFlow Inc', 'DataSoft LLC', 'CloudPeak', 'WebForge', 'DevStack Ltd', 'ByteWorks'];
const jobTitles = ['Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Product Manager', 'QA Engineer', 'Data Analyst', 'Team Lead', 'CTO', 'Designer', 'Fullstack Developer'];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPhone(): string {
  return `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`;
}

function randomDate(from: Date, to: Date): string {
  const ts = from.getTime() + Math.random() * (to.getTime() - from.getTime());
  return new Date(ts).toISOString().split('T')[0];
}

function randomIP(): string {
  return `${randomInt(1, 255)}.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

export function generateMockUsers(count: number): Record<string, unknown>[] {
  return Array.from({ length: count }, (_, i) => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${pick(domains)}`;
    return {
      id: i + 1,
      first_name: firstName,
      last_name: lastName,
      email,
      phone: randomPhone(),
      age: randomInt(18, 65),
      city: pick(cities),
      company: pick(companies),
      job_title: pick(jobTitles),
      ip_address: randomIP(),
      is_active: Math.random() > 0.2,
      registered_at: randomDate(new Date('2020-01-01'), new Date()),
    };
  });
}