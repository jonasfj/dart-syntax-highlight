import { fileTests } from "@lezer/generator/dist/test"
import { readdirSync, readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import { parser } from "../src/parser.js"

const caseDir = dirname(fileURLToPath(import.meta.url))

for (const file of readdirSync(caseDir)) {
  if (!/\.txt$/.test(file)) continue
  const name = /^[^.]*/.exec(file)![0]
  describe(name, () => {
    for (const { name: n, run } of fileTests(readFileSync(join(caseDir, file), "utf8"), file))
      it(n, () => run(parser))
  })
}
