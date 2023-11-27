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
import { findBlockIndices } from "./utils.js";

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

let blockIndices = findBlockIndices(astCode);
// blockIndices = blockIndices.filter((item) => item.codeStart);
// blockIndices.sort((a, b) => a.end - a.start - (b.end - b.start));

console.log(blockIndices);

let mark;

editor.on("cursorActivity", function () {
  if (mark) {
    removeHighlight(mark);
  }
  const cursor = editor.getCursor();
  let absolutePosition = editor.indexFromPos(cursor);
  absolutePosition = absolutePosition + cursor.line;

  console.log("Cursor position:", absolutePosition);

  // find the start and end of the block
  const block = blockIndices.find(
    (item) =>
      absolutePosition >= item.codeStart && absolutePosition <= item.codeEnd
  );

  console.log("Block:", block);

  if (block) {
    mark = highlight(block.start, block.end);
    scrollToLine(block.start);
  }
});

astEditor.on("cursorActivity", function () {
  const cursor = astEditor.getCursor();
  let absolutePosition = astEditor.indexFromPos(cursor);
  absolutePosition = absolutePosition;
  console.log("AST Cursor position:", absolutePosition);
});

function highlight(start, end) {
  start = astEditor.posFromIndex(start);
  end = astEditor.posFromIndex(end);

  const mark = astEditor.markText(start, end, {
    className: "highlighted-block",
  });

  return mark;
}

function removeHighlight(mark) {
  mark.clear();
}

function scrollToLine(position) {
  const lineNumber = astEditor.posFromIndex(position).line;
  astEditor.scrollTo(
    null,
    astEditor.charCoords({ line: lineNumber - 1, ch: 0 }, "local").top
  );
}
