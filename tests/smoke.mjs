import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
assert.equal(fs.existsSync(path.resolve("SKILL.md")), true);
assert.equal(fs.existsSync(path.resolve("bin/cli.js")), true);
console.log("smoke ok");