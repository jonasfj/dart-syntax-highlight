import { describe, it } from "node:test";
import { dart } from "../../dist/index.js"
import { EditorState } from "@codemirror/state"
import { getIndentation, syntaxTree } from "@codemirror/language"
import assert from "node:assert"

function checkIndent(doc: string, marker: string = "|") {
  let lines = doc.split("\n");
  let markerLine = lines.findIndex(l => l.includes(marker));
  if (markerLine < 0) throw new Error("Marker not found");
  
  let cleanLines = lines.map(l => l.replace(marker, ""));
  let cleanDoc = cleanLines.join("\n");
  
  let state = EditorState.create({
    doc: cleanDoc,
    extensions: [dart()]
  });
  
  // ensure syntax tree is parsed
  syntaxTree(state);
  
  let pos = state.doc.line(markerLine + 1).from;
  let indent = getIndentation(state, pos);
  
  return indent;
}

describe("Dart Indentation", () => {
  it("indents basic blocks", () => {
    assert.strictEqual(checkIndent(`void main() {\n|`), 2);
  });

  it("indents nested blocks", () => {
    assert.strictEqual(checkIndent(`void main() {\n  if (true) {\n|`), 4);
  });

  it("dedents closing braces", () => {
    assert.strictEqual(checkIndent(`void main() {\n  if (true) {\n    print("hello");\n  }\n|`), 2);
  });

  it("indents continued statements", () => {
    assert.strictEqual(checkIndent(`void main() {\n  var x = 1 +\n|`), 4);
  });

  it("handles empty files gracefully", () => {
    assert.strictEqual(checkIndent(`\n|`), 0);
  });
});
