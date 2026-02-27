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

### Feature Status

This package aims to provide a robust highlighter for Dart 3.x.

**Supported Features:**
*   **Modern Class Modifiers**: `base`, `interface`, `final`, `sealed`, `mixin class`.
*   **Enhanced Enums**: Support for members, constructors, and proper punctuation.
*   **Extension Types**: Support for `extension type` declarations.
*   **Robust Indentation**: Fixed issues with optional modifiers capturing preceding whitespace.
*   **Mixed Parsing**: Markdown support within documentation comments (`///` and `/** */`).

**Missing / Limited Features:**
*   **Patterns**: Basic pattern support is present, but complex `ObjectPattern` and `RecordPattern` are currently disabled in some contexts to avoid massive ambiguity with constructors and types.

## License

BSD-3-Clause (see [LICENSE](../LICENSE) in the root of this repository).
