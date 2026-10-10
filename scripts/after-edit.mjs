#!/usr/bin/env node
// PostToolUse hook for Claude Code and Codex: formats the file an agent just wrote and reports lint findings back to it.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative } from 'node:path';

const TIMEOUT_MS = 15_000;
const MAX_REPORTED = 12;
const FORMATTABLE = /\.(?:ts|tsx|js|jsx|mjs|cjs|json|css|html|ya?ml)$/;
const LINTABLE = /\.(?:ts|tsx|js|jsx|mjs|cjs)$/;

const finish = (additionalContext) => {
  if (additionalContext) {
    process.stdout.write(
      JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext } }),
    );
  }
  process.exit(0);
};

const readPayload = () => {
  try {
    return JSON.parse(readFileSync(0, 'utf8'));
  } catch {
    return undefined;
  }
};

const payload = readPayload();
const root = payload?.cwd || process.cwd();
const written = payload?.tool_response?.filePath || payload?.tool_input?.file_path;
if (!written) finish();

const absolutePath = isAbsolute(written) ? written : join(root, written);
const target = relative(root, absolutePath);
if (target.startsWith('..') || target.startsWith('docs') || !existsSync(absolutePath)) finish();

const runNodeBin = (binPath, argumentList) => {
  try {
    return execFileSync(process.execPath, [join(root, binPath), ...argumentList], {
      cwd: root,
      encoding: 'utf8',
      timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (failure) {
    return typeof failure?.stdout === 'string' ? failure.stdout : '';
  }
};

if (FORMATTABLE.test(target)) {
  runNodeBin('node_modules/prettier/bin/prettier.cjs', ['--write', target]);
}

if (!LINTABLE.test(target)) finish();

const lintFindings = () => {
  const output = runNodeBin('node_modules/eslint/bin/eslint.js', ['--format', 'json', target]);
  try {
    return JSON.parse(output).flatMap((file) =>
      file.messages.map(
        (message) =>
          `${message.severity === 2 ? 'error' : 'warning'} ${message.ruleId ?? 'parse'} ${target}:${message.line} — ${message.message}`,
      ),
    );
  } catch {
    return [];
  }
};

const findings = lintFindings();
if (findings.length === 0) finish();

const overflow =
  findings.length > MAX_REPORTED ? `\n…and ${findings.length - MAX_REPORTED} more.` : '';
finish(
  `Lint findings in the file you just wrote (${target}). Fix them now; do not disable the rule:\n${findings.slice(0, MAX_REPORTED).join('\n')}${overflow}`,
);
