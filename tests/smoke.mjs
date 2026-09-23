import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
assert.equal(fs.existsSync(path.resolve(root, "SKILL.md")), true);
assert.equal(fs.existsSync(path.resolve(root, "bin/cli.js")), true);

const check = spawnSync(process.execPath, ["--check", "bin/cli.js"], { encoding: "utf8" });
assert.equal(check.status, 0, check.stderr);

const pkg = JSON.parse(fs.readFileSync(path.resolve(root, "package.json"), "utf8"));
assert.equal(pkg.name, "nodejs-web-security-skill");
assert.equal(pkg.bin["nodejs-web-security-skill"], "./bin/cli.js");
assert.ok(pkg.files.includes("SKILL.md"));

console.log("smoke ok");