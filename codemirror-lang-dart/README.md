# codemirror-lang-dart

Dart language support for [CodeMirror 6](https://codemirror.net/).

This package provides a Lezer-based Dart grammar and language support for CodeMirror.

## Installation

```bash
npm install codemirror-lang-dart
```

## Usage

```javascript
import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { dart } from "codemirror-lang-dart"

new EditorView({
  state: EditorState.create({
    doc: "void main() {\n  print('Hello, World!');\n}",
    extensions: [basicSetup, dart()]
  }),
  parent: document.body
})
```

## License

BSD-3-Clause (see [LICENSE](../LICENSE) in the root of this repository).
