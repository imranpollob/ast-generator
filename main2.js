import { basicSetup } from "codemirror";
import { EditorView, ViewPlugin } from "@codemirror/view";
import { EditorState, EditorSelection, Transaction } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { code, ast } from "./testSourceCode.js";

const clickPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) {
      view.dom.addEventListener("click", () => {
        console.log(view.state.selection.main.head);
      });
      view.dom.addEventListener("keydown", () => {
        console.log(view.state.selection.main.head);
      });
    }
  }
);

function highlightSelection(editor, start, end) {
  // Create a new selection range
  const range = EditorSelection.range(start, end);

  // Create a new Transaction that sets the selection
  const tr = editor.state.update({
    selection: { anchor: start, head: end },
  });

  // Apply the Transaction
  editor.dispatch(tr);
}

const editor = new EditorView({
  doc: code,
  extensions: [basicSetup, javascript(), clickPlugin],
  parent: document.querySelector("#editor"),
});

const astEditor = new EditorView({
  doc: ast,
  extensions: [basicSetup, json()],
  parent: document.querySelector("#ast"),
});

highlightSelection(astEditor, 0, 10);
