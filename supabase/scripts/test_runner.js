/**
 * AERO — Test Runner for SQL changes.
 * Usage: node supabase/scripts/test_runner.js [task_name]
 *
 * Workflow:
 * 1. Create test/fix SQL in /supabase/tests/
 * 2. Run this script with the task name.
 * 3. Once it passes, merge SQL into the relevant pillar file.
 * 4. Delete the test SQL.
 * 5. Run full validation.
 * 6. Sync to console: node supabase/scripts/sync_to_console.js
 */

const taskName = process.argv[2];

if (!taskName) {
  console.error('Usage: node supabase/scripts/test_runner.js <task_name>');
  console.error('Example: node supabase/scripts/test_runner.js add_scan_index');
  process.exit(1);
}

console.log(`[AERO Test Runner] Task: ${taskName}`);
console.log('[AERO Test Runner] Looking for test file...');

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const testFile = join(process.cwd(), 'supabase', 'tests', `${taskName}.sql`);

if (!existsSync(testFile)) {
  console.error(`[AERO Test Runner] Test file not found: ${testFile}`);
  process.exit(1);
}

const sql = readFileSync(testFile, 'utf-8');
console.log('[AERO Test Runner] SQL to execute:');
console.log(sql);
console.log('[AERO Test Runner] In production, this would execute against your Supabase instance.');
console.log('[AERO Test Runner] Done.');
