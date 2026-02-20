/**
 * AERO — Sync pillar migrations to Supabase console.
 * Usage: node supabase/scripts/sync_to_console.js
 *
 * Reads all pillar migration files and outputs combined SQL
 * for manual pasting into the Supabase SQL Editor.
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const MIGRATIONS_DIR = join(process.cwd(), 'supabase', 'migrations');

const files = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith('.sql'))
  .sort();

console.log('-- AERO Pillar Migrations (Combined)');
console.log('-- Generated:', new Date().toISOString());
console.log('-- Files:', files.join(', '));
console.log('');

for (const file of files) {
  const content = readFileSync(join(MIGRATIONS_DIR, file), 'utf-8');
  console.log(`-- ========== ${file} ==========`);
  console.log(content);
  console.log('');
}

console.log('-- END OF MIGRATIONS');
