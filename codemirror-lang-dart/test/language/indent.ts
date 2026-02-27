import { dart } from "../../dist/index.js"
import { EditorState } from "@codemirror/state"
import { getIndentation, syntaxTree } from "@codemirror/language"

function checkIndent(doc: string, marker: string = "|") {
  let pos = doc.indexOf(marker);
  if (pos < 0) throw new Error("Marker not found");
  let newDoc = doc.replace(marker, "");
  let state = EditorState.create({ doc: newDoc, extensions: [dart()] });
  return { indent: getIndentation(state, pos) };
}

function run() {
  console.log("Testing Dart Indentation...");

  try {
    let { indent: indent1 } = checkIndent(`\n|\nclass Greeter {}`);
    if (indent1 !== 0) {
      throw new Error(`Failed: Expected indent 0 before class, got ${indent1}`);
    }
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  try {
    let { indent: indent2 } = checkIndent(`\n|\nvoid main() {}`);
    if (indent2 !== 0) {
      throw new Error(`Failed: Expected indent 0 before function, got ${indent2}`);
    }
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  try {
    let { indent: indent3 } = checkIndent(`class Greeter\n|`);
    if (indent3 !== 2) throw new Error(`Failed: Expected indent 2, got ${indent3}`);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  try {
    let { indent: indent4 } = checkIndent(`void main(\n|`);
    if (indent4 !== 2) throw new Error(`Failed: Expected indent 2, got ${indent4}`);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  console.log("All indentation tests passed.");
}

run();
