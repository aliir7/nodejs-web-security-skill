#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const adapters = {
  generic: [["adapters/generic/AGENTS.md", "AGENTS.md"]],
  claude: [["adapters/claude/SKILL.md", "SKILL.md"]],
  codex: [["adapters/codex/SKILL.md", "SKILL.md"]],
  gemini: [["adapters/gemini/GEMINI.md", "GEMINI.md"]],
  cursor: [["adapters/cursor/.cursor/rules/nodejs-web-security.mdc", ".cursor/rules/nodejs-web-security.mdc"]],
  copilot: [["adapters/copilot/.github/copilot-instructions.md", ".github/copilot-instructions.md"]]
};

function copyFile(sourceRel, destinationRoot, destinationRel) {
  const source = path.join(ROOT, sourceRel);
  const destination = path.join(destinationRoot, destinationRel);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function installAdapter(name, destinationRoot) {
  for (const [source, destination] of adapters[name]) {
    copyFile(source, destinationRoot, destination);
  }
}

function usage() {
  console.log([
    "Node.js Web Security Skill",
    "",
    "Usage:",
    "  npx nodejs-web-security-skill init .",
    "  npx nodejs-web-security-skill install <generic|claude|codex|gemini|cursor|copilot> .",
    "  npx nodejs-web-security-skill doctor ."
  ].join("\n"));
}

const [command, arg, dir = "."] = process.argv.slice(2);
const target = path.resolve(dir);

if (command === "init") {
  for (const rel of ["SKILL.md", "skill.yaml", "references", "examples", "checklists", "rules", "templates"]) {
    const source = path.join(ROOT, rel);
    const destination = path.join(target, rel);
    if (fs.statSync(source).isDirectory()) {
      fs.cpSync(source, destination, { recursive: true });
    } else {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(source, destination);
    }
  }
  installAdapter("generic", target);
  console.log("Installed Node.js Web Security Skill.");
  process.exit(0);
}

if (command === "install" && adapters[arg]) {
  installAdapter(arg, target);
  console.log(`Installed ${arg} adapter.`);
  process.exit(0);
}

if (command === "doctor") {
  const checks = ["SKILL.md", "AGENTS.md", ".github/copilot-instructions.md", ".cursor/rules/nodejs-web-security.mdc"];
  for (const p of checks) console.log(fs.existsSync(path.join(target, p)) ? "✓" : "·", p);
  process.exit(0);
}

usage();
process.exit(1);
