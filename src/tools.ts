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