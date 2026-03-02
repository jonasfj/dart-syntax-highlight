import { describe, it, after } from "node:test";
import { parser } from "../dist/index.js";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";
import assert from "node:assert";

const curatedRoot = join(process.cwd(), "test/dart-test-files");

// Files that we explicitly know parse cleanly. If any of these fail, the test fails.
const KNOWN_CLEAN_FILES = new Set([
  "class/basic_class.dart",
  "class/inheritance.dart",
  "class/methods.dart",
  "class/modifiers.dart",
  "comments/doc_comments.dart",
  "control_flow/if_else.dart",
  "control_flow/loops.dart",
  "control_flow/switch_basic.dart",
  "directive/library.dart",
  "expressions/cascade.dart",
  "variables/local_vars.dart",
  "variables/top_level.dart"
]);

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!existsSync(dirPath)) return arrayOfFiles;
  
  const files = readdirSync(dirPath);

  files.forEach(function(file) {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith(".dart")) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(curatedRoot);

describe("Curated Dart Files", () => {
  let totalErrorsInDirty = 0;
  let newCleanFiles: string[] = [];
  let knownDirtyFiles: string[] = [];

  after(() => {
    console.log("\n--- File Parsing Summary ---");
    if (newCleanFiles.length > 0) {
      console.log("\n🎉 [NEW CLEAN] Consider adding these to KNOWN_CLEAN_FILES:");
      newCleanFiles.forEach(f => console.log(`  - ${f}`));
    }
    
    if (knownDirtyFiles.length > 0) {
      console.log("\n⚠️ [KNOWN DIRTY] Files that still need grammar fixes:");
      knownDirtyFiles.forEach(f => console.log(`  - ${f}`));
    }
    console.log(`\nTotal errors in non-passing files: ${totalErrorsInDirty}`);
    console.log("----------------------------\n");
  });

  for (let file of allFiles) {
    const relPath = relative(curatedRoot, file);
    const isKnownClean = KNOWN_CLEAN_FILES.has(relPath);

    it(`parses ${relPath} ${isKnownClean ? '(KNOWN CLEAN)' : '(KNOWN DIRTY)'}`, () => {
      const code = readFileSync(file, "utf8");
      const tree = parser.parse(code);
      
      let errors: { line: number, snippet: string }[] = [];
      tree.iterate({
        enter: (node) => {
          if (node.type.isError) {
            const line = code.slice(0, node.from).split("\n").length;
            const snippet = code.slice(node.from, Math.min(node.to + 30, code.length));
            errors.push({ line, snippet });
          }
        }
      });

      if (isKnownClean) {
        // This MUST pass.
        const errorMessage = `Expected 0 errors, got ${errors.length}:\n` + 
          errors.map(e => `   -> Line ${e.line}: "${e.snippet.replace(/\n/g, "\\n")}..."`).join('\n');
        assert.strictEqual(errors.length, 0, errorMessage);
      } else {
        // Just record stats for known dirty files
        if (errors.length === 0) {
          newCleanFiles.push(relPath);
        } else {
          totalErrorsInDirty += errors.length;
          knownDirtyFiles.push(`${relPath} (${errors.length} errors)`);
        }
      }
    });
  }
});
