import { dartLanguage, dart } from "../../dist/index.js"
import { SyntaxNode } from "@lezer/common"
import { EditorState } from "@codemirror/state"
import { ensureSyntaxTree, syntaxTree } from "@codemirror/language"

function getNodeAt(state: EditorState, pos: number, nameToFind: string): boolean {
  let node: SyntaxNode | null = syntaxTree(state).resolveInner(pos, 1);
  while (node) {
    if (node.name === nameToFind) return true;
    node = node.parent;
  }
  return false;
}

function run() {
  console.log("Testing Dart Mixed Parsing...");

  console.log(" - should not crash when a DocComment is followed by a LineComment");
  const code1 = `/// # hello\n// **test**\nclass Greeter {}`;
  try {
    let state1 = EditorState.create({ doc: code1, extensions: [dart()] });
    let tree1 = ensureSyntaxTree(state1, code1.length, 1000);
    let foundDocComment = false;
    tree1.iterate({
      enter(node) {
        if (node.name === "DocComment") foundDocComment = true;
      }
    });
    if (!foundDocComment) throw new Error("DocComment not found in tree");
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  console.log(" - should handle empty lines between DocComment segments correctly");
  const code2 = `/// Line 1\n   \n/// Line 2`;
  try {
    EditorState.create({ doc: code2, extensions: [dart()] });
  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  console.log(" - should highlight markdown only in appropriate contexts");
  const code3 = `/// **bold**
/// \`\`\`dart
/// void main() => print('**bold**');
/// \`\`\`
/// **bold**
void main() => print('**bold**');`;

  try {
    let state3 = EditorState.create({ doc: code3, extensions: [dart()] });
    let tree3 = ensureSyntaxTree(state3, code3.length, 1000);
    
    const instances: number[] = [];
    let idx = code3.indexOf('**bold**');
    while (idx !== -1) {
      instances.push(idx);
      idx = code3.indexOf('**bold**', idx + 1);
    }

    if (instances.length !== 4) {
      throw new Error(`Expected exactly 4 instances of '**bold**', found ${instances.length}`);
    }

    if (!getNodeAt(state3, instances[0], "StrongEmphasis")) {
      console.log("Tree:", tree3.toString());
      console.log("Nodes at instance 0:");
      let n: SyntaxNode | null = syntaxTree(state3).resolveInner(instances[0], 1);
      while(n) { console.log(" - " + n.name); n = n.parent; }
      throw new Error("Instance 1: Expected StrongEmphasis in markdown block.");
    }
    
    if (getNodeAt(state3, instances[1], "StrongEmphasis")) {
      throw new Error("Instance 2: Should NOT be StrongEmphasis inside code fence.");
    }
    if (!getNodeAt(state3, instances[1], "CodeText")) {
      throw new Error("Instance 2: Expected CodeText inside markdown code fence.");
    }

    if (!getNodeAt(state3, instances[2], "StrongEmphasis")) {
      throw new Error("Instance 3: Expected StrongEmphasis in markdown block.");
    }

    if (getNodeAt(state3, instances[3], "StrongEmphasis")) {
      throw new Error("Instance 4: Should NOT be StrongEmphasis inside Dart code.");
    }
    if (!getNodeAt(state3, instances[3], "SingleString") && !getNodeAt(state3, instances[3], "String")) {
      throw new Error("Instance 4: Expected SingleString in main Dart code.");
    }

  } catch(e) {
    console.error(e);
    process.exit(1);
  }

  console.log("All mixed parsing tests passed.");
}

run();
