import { fileTests } from "@lezer/generator/dist/test"
import { readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { parser } from "../../src/parser.js"

const caseDir = join(dirname(fileURLToPath(import.meta.url)), "testdata")

let failed = false;

for (const file of readdirSync(caseDir)) {
  if (!/\.txt$/.test(file)) continue
  const name = /^[^.]*/.exec(file)![0]
  console.log(`Running grammar tests for ${name}...`)
  
  for (const { name: n, run } of fileTests(readFileSync(join(caseDir, file), "utf8"), file)) {
    try {
      run(parser)
    } catch (e) {
      console.error(`  Test ${n} FAILED:`, e)
      failed = true;
    }
  }
}

if (failed) {
  process.exit(1);
} else {
  console.log("All lezer grammar tests passed.");
}
