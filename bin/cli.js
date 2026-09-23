#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const targets={generic:["adapters/generic/AGENTS.md"],claude:["adapters/claude/SKILL.md"],codex:["adapters/codex/SKILL.md"],gemini:["adapters/gemini/GEMINI.md"],cursor:["adapters/cursor/.cursor/rules/nodejs-web-security.mdc"],copilot:["adapters/copilot/.github/copilot-instructions.md"]};
function copy(rel,dest){const s=path.join(ROOT,rel),d=path.join(dest,rel),st=fs.statSync(s);if(st.isDirectory()){fs.mkdirSync(d,{recursive:true});for(const x of fs.readdirSync(s))copy(path.join(rel,x),dest)}else{fs.mkdirSync(path.dirname(d),{recursive:true});fs.copyFileSync(s,d)}}
const [cmd,arg,dir="."]=process.argv.slice(2);
if(cmd==="init"){for(const rel of ["SKILL.md","skill.yaml","references","examples","checklists","rules","templates","adapters/generic/AGENTS.md"])copy(rel,path.resolve(dir));console.log("Installed Node.js Web Security Skill.");process.exit(0)}
if(cmd==="install"&&targets[arg]){for(const rel of targets[arg])copy(rel,path.resolve(dir));console.log("Installed "+arg+" adapter.");process.exit(0)}
if(cmd==="doctor"){const d=path.resolve(arg||".");for(const p of ["SKILL.md","AGENTS.md",".github/copilot-instructions.md",".cursor/rules/nodejs-web-security.mdc"])console.log(fs.existsSync(path.join(d,p))?"✓":"·",p);process.exit(0)}
console.log("Usage: npx nodejs-web-security-skill init .");