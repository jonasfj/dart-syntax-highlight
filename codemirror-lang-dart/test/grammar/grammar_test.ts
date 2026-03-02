import { describe, it } from "node:test";
import { fileTests } from "@lezer/generator/dist/test"
import { readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { parser } from "../../dist/index.js"

const caseDir = join(dirname(fileURLToPath(import.meta.url)), "testdata")

describe("Lezer Grammar Tests", () => {
  for (let file of readdirSync(caseDir)) {
    if (!/\.txt$/.test(file)) continue

    let name = /^[^\.]*/.exec(file)![0]
    
    describe(name, () => {
      for (let {name: testName, run} of fileTests(readFileSync(join(caseDir, file), "utf8"), file)) {
        it(testName, () => run(parser))
      }
    })
  }
})
