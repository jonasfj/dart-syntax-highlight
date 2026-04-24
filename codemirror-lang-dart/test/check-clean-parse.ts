import { parser } from "../dist/index.js";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

const sdkTestsRoot = join(process.cwd(), "third_party/dart-sdk");

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

const allFiles = getAllFiles(sdkTestsRoot);

interface Stats {
  total: number;
  clean: number;
  dirty: number;
  errorNodes: number;
}

const summary: Record<string, Stats> = {};

console.log(`Analyzing ${allFiles.length} Dart files...\n`);

allFiles.forEach(file => {
  const relativePath = relative(sdkTestsRoot, file);
  // get top level folder (language or parser_testcases)
  // and the subfolder. So e.g. "language/control_flow"
  const parts = relativePath.split("/");
  const dir = parts.length > 1 ? `${parts[0]}/${parts[1]}` : parts[0];

  if (!summary[dir]) {
    summary[dir] = { total: 0, clean: 0, dirty: 0, errorNodes: 0 };
  }

  const code = readFileSync(file, "utf8");
  const tree = parser.parse(code);
  
  let fileErrorNodes = 0;
  tree.iterate({
    enter: (node) => {
      if (node.type.isError) {
        fileErrorNodes++;
      }
    }
  });

  summary[dir].total++;
  summary[dir].errorNodes += fileErrorNodes;
  if (fileErrorNodes === 0) {
    summary[dir].clean++;
  } else {
    summary[dir].dirty++;
  }
});

console.log(
  "Directory".padEnd(35) + 
  "Total".padStart(8) + 
  "Clean".padStart(8) + 
  "Dirty".padStart(8) + 
  "ErrNodes".padStart(10)
);
console.log("-".repeat(69));

let grandTotal = 0;
let grandClean = 0;
let grandDirty = 0;
let grandErrorNodes = 0;

Object.entries(summary)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .forEach(([dir, stats]) => {
  console.log(
    dir.padEnd(35) + 
    stats.total.toString().padStart(8) + 
    stats.clean.toString().padStart(8) + 
    stats.dirty.toString().padStart(8) + 
    stats.errorNodes.toString().padStart(10)
  );
  grandTotal += stats.total;
  grandClean += stats.clean;
  grandDirty += stats.dirty;
  grandErrorNodes += stats.errorNodes;
});

console.log("-".repeat(69));
console.log(
  "TOTAL".padEnd(35) + 
  grandTotal.toString().padStart(8) + 
  grandClean.toString().padStart(8) + 
  grandDirty.toString().padStart(8) + 
  grandErrorNodes.toString().padStart(10)
);
