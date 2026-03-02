import { parser } from "../dist/index.js";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

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

let regressionCount = 0;
let totalErrorsInDirty = 0;

console.log(`Checking curated Dart files in ${curatedRoot}...\n`);

allFiles.forEach(file => {
  const relPath = relative(curatedRoot, file);
  const code = readFileSync(file, "utf8");
  const tree = parser.parse(code);
  
  let errors: { line: number, snippet: string }[] = [];
  tree.iterate({
    enter: (node) => {
      if (node.type.isError) {
        const line = code.slice(0, node.from).split("\n").length;
        const snippet = code.slice(node.from, Math.min(node.to + 20, code.length));
        errors.push({ line, snippet });
      }
    }
  });

  const isKnownClean = KNOWN_CLEAN_FILES.has(relPath);

  if (errors.length === 0) {
    if (isKnownClean) {
      console.log(`✅ [PASS] ${relPath}`);
    } else {
      console.log(`🎉 [NEW CLEAN] ${relPath} - Consider adding to KNOWN_CLEAN_FILES!`);
    }
  } else {
    if (isKnownClean) {
      console.error(`❌ [REGRESSION] ${relPath} (${errors.length} errors)`);
      errors.forEach(err => console.error(`   -> Line ${err.line}: "${err.snippet.replace(/\n/g, "\\n")}..."`));
      regressionCount++;
    } else {
      console.log(`⚠️ [KNOWN DIRTY] ${relPath} (${errors.length} errors)`);
      totalErrorsInDirty += errors.length;
    }
  }
});

console.log("\n" + "-".repeat(50));
console.log(`Regressions: ${regressionCount}`);
console.log(`Total errors in non-passing files: ${totalErrorsInDirty}`);
console.log("-".repeat(50));

if (regressionCount > 0) {
  console.error("\nTEST FAILED: One or more files in KNOWN_CLEAN_FILES have regressed.");
  process.exit(1);
}
