import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";
import "codemirror/addon/fold/foldgutter";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/monokai.css";
import "codemirror/addon/display/autorefresh";
import "codemirror/addon/selection/active-line";
import "codemirror/addon/selection/mark-selection";
import "codemirror/addon/selection/selection-pointer";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/matchtags";

import { code, jscode, astCode } from "./testSourceCode.js";

// Initialize CodeMirror with the textarea element
const editor = CodeMirror(document.querySelector("#code-editor"), {
  value: code,
  mode: "javascript",
  lineNumbers: true,
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  // theme: "monokai",
  styleActiveLine: true,
  styleSelectedText: true,
  selectionPointer: true,
  lineWrapping: true,
  autoRefresh: true,
  matchBrackets: true,
  matchTags: true,
  // lineSeparator: "\n",
});

const astEditor = CodeMirror(document.querySelector("#ast-editor"), {
  value: astCode,
  mode: "javascript",
  lineNumbers: true,
  foldGutter: true,
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
  // theme: "monokai",
  styleActiveLine: true,
  styleSelectedText: true,
  selectionPointer: true,
  lineWrapping: true,
  autoRefresh: true,
  matchBrackets: true,
  matchTags: true,
});

editor.on("cursorActivity", function () {
  const cursor = editor.getCursor();
  console.log("Cursor position: ", cursor, cursor.line);
  const absolutePosition = editor.indexFromPos(cursor);
  console.log(
    "Absolute cursor position:",
    absolutePosition,
    absolutePosition + cursor.line
  );
});

function highlightBlock(startLine, startCh, endLine, endCh) {
  const start = { line: startLine, ch: startCh };
  const end = { line: endLine, ch: endCh };

  const mark = astEditor.markText(start, end, {
    className: "highlighted-block",
  });

  return mark;
}

function removeHighlight(mark) {
  mark.clear();
}

const myMark = highlightBlock(3, 5, 7, 12);

// setTimeout(() => {
//   removeHighlight(myMark);
// }, 3000); // Remove after 3 seconds as an example
