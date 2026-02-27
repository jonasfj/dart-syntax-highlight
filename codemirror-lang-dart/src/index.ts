import { parser } from "./parser"
import {
  LRLanguage,
  LanguageSupport,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  continuedIndent,
  delimitedIndent
} from "@codemirror/language"
import { dartHighlight } from "./highlight"

/// A language provider based on the Lezer Dart parser, extended with
/// highlighting and indentation information.
export const dartLanguage = LRLanguage.define({
  name: "dart",
  parser: parser.configure({
    props: [
      dartHighlight,
      indentNodeProp.add({
        IfStatement: continuedIndent({ except: /^\s*({|else\b)/ }),
        TryStatement: continuedIndent({ except: /^\s*({|catch\b|finally\b|on\b)/ }),
        "Block ClassBody": delimitedIndent({ closing: "}" }),
        "Statement Declaration": continuedIndent()
      }),
      foldNodeProp.add({
        "Block ClassBody": foldInside,
        BlockComment(tree) { return { from: tree.from + 2, to: tree.to - 2 } }
      })
    ]
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*[{}]$|^\s*(?:case |default:|else\b|catch\b|finally\b|on\b)/,
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "'''", '"""'] },
    wordChars: "$"
  }
})

/// Dart language support.
export function dart() {
  return new LanguageSupport(dartLanguage)
}
