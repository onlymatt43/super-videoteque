#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envTargets = [
  {
    label: 'Backend',
    file: path.join(rootDir, 'backend', '.env'),
    entries: [
      { key: 'NODE_ENV', description: 'Node environment (development/production)', defaultValue: 'development' },
      { key: 'PORT', description: 'Backend port', defaultValue: '4000' },
      { key: 'MONGO_URI', description: 'MongoDB connection string', required: true },
      { key: 'PAYHIP_API_BASE_URL', description: 'Payhip API base URL', defaultValue: 'https://payhip.com/api/v2' },
      { key: 'PAYHIP_API_KEY', description: 'Payhip API key', required: true },
      { key: 'PAYHIP_PRODUCT_ID', description: 'Payhip product ID (license product)', required: true },
      { key: 'BUNNY_PULL_ZONE_HOST', description: 'Bunny pull-zone hostname (without protocol)', required: true },
      { key: 'BUNNY_SIGNING_KEY', description: 'Bunny pull-zone signing key', required: true },
      { key: 'BUNNY_LIBRARY_ID', description: 'Bunny video library ID', required: true },
      { key: 'BUNNY_API_KEY', description: 'Bunny video library access key', required: true },
      { key: 'DEFAULT_RENTAL_HOURS', description: 'Default rental duration (hours)', defaultValue: '48' }
    ]
  },
  {
    label: 'Frontend',
    file: path.join(rootDir, 'frontend', '.env'),
    entries: [
      { key: 'VITE_API_BASE_URL', description: 'Base URL of the backend API (e.g. http://localhost:4000)', required: true }
    ]
  }
];

const parseEnv = (content) => {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const idx = line.indexOf('=');
      if (idx === -1) return acc;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key) acc[key] = value;
      return acc;
    }, {});
};

const serializeEnv = (entries, values) => {
  const lines = entries.map(({ key }) => `${key}=${values[key] ?? ''}`);
  lines.push('');
  return lines.join('\n');
};

const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

const promptValue = async (rl, entry, current) => {
  const hint = current ?? entry.defaultValue ?? '';
  const question = `${entry.description}\n${entry.key}${hint ? ` [${hint}]` : ''}: `;
  const answer = (await rl.question(question)).trim();
  if (answer) return answer;
  if (current) return current;
  if (entry.defaultValue) return entry.defaultValue;
  if (entry.required) {
    console.log('This value is required.');
    return promptValue(rl, entry, current);
  }
  return '';
};

const configureFile = async (target) => {
  ensureDir(target.file);
  const existingContent = existsSync(target.file) ? readFileSync(target.file, 'utf8') : '';
  const existingValues = parseEnv(existingContent);
  const rl = createInterface({ input, output });
  console.log(`\n▶ Configuring ${target.label} env (${target.file})`);

  const nextValues = { ...existingValues };
  for (const entry of target.entries) {
    nextValues[entry.key] = await promptValue(rl, entry, existingValues[entry.key]);
  }

  rl.close();
  writeFileSync(target.file, serializeEnv(target.entries, nextValues), 'utf8');
  console.log(`✅ Wrote ${target.file}`);
};

const run = async () => {
  for (const target of envTargets) {
    await configureFile(target);
  }
  console.log('\nAll done! You can now run npm run dev/build as needed.');
};

run().catch((error) => {
  console.error('Failed to configure env files:', error);
  process.exit(1);
});
