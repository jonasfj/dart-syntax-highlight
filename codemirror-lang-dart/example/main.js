import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { oneDark } from "@codemirror/theme-one-dark"
import { dart } from "codemirror-lang-dart"

const initialCode = `// Dart Example
void main() {
  var name = 'Dart';
  print('Hello, $name!');
  
  for (var i = 0; i < 5; i++) {
    print('Iteration $i');
  }
}

class Greeter {
  final String greeting;
  Greeter(this.greeting);
  
  void greet(String name) => print('$greeting, $name!');
}
`;

new EditorView({
  state: EditorState.create({
    doc: initialCode,
    extensions: [
      basicSetup,
      oneDark,
      dart()
    ]
  }),
  parent: document.querySelector("#editor")
})
