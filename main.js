import CodeMirror from "codemirror";
import { findBlockIndices, findParentPathAndNodeType } from "./utils.js";
import { code, jscode, astCode } from "./testSourceCode.js";
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
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/search/search.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/jump-to-line.js";
import "codemirror/addon/search/match-highlighter.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";

const btn = document.querySelector("#convertBtn");
const nodeType = document.querySelector("#node-tree-display");
const pinButton = document.querySelector("#pin-button");
const unpinButton = document.querySelector("#unpin-button");
let mark;
let blockIndices;
let compiledAst;
let isDirty = true;

// Editor setup
export const editor = CodeMirror(document.querySelector("#code-editor"), {
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
  autoCloseBrackets: true,
  indentUnit: 4,
  search: true,
});

// AST Editor setup
export const astEditor = CodeMirror(document.querySelector("#ast-editor"), {
  // value: astCode,
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
  readOnly: true,
  search: true,
});

editor.on("cursorActivity", function () {
  if (isDirty) return;

  removeHighlight();

  const cursor = editor.getCursor();
  let pos = editor.indexFromPos(cursor);
  const block = blockIndices.find(
    (item) => pos >= item.codeStart && pos <= item.codeEnd
  );

  // NOTE: Uncomment the following lines to see the cursor position and matched block
  // console.log("Cursor position:", pos);
  // console.log("Matched block:", block);

  if (block) {
    mark = highlight(block.start, block.end);
    scrollToLine(block.start);
  }
});

editor.on("change", function (instance, changeObj) {
  if (!!changeObj && !isDirty) {
    isDirty = true;
    removeHighlight();
    nodeType.innerText = "";
    nodeType.classList.add("display-none");
    btn.innerText = "Compile Now";
    btn.classList.add("dirty");
  }
});

astEditor.on("cursorActivity", function () {
  const cursor = astEditor.getCursor();
  let pos = astEditor.indexFromPos(cursor);
  // console.log("AST Cursor position:", pos);
});

// Functionalities
function highlight(start, end) {
  if (isDirty) return;

  const target = JSON.parse(astEditor.getValue().slice(start, end));
  start = astEditor.posFromIndex(start);
  end = astEditor.posFromIndex(end);

  displayNodePath(target);

  return astEditor.markText(start, end, {
    className: "highlighted-block",
  });
}

function displayNodePath(target) {
  nodeType.innerText = target.nodeType;
  let targetPath = findParentPathAndNodeType(
    JSON.parse(astEditor.getValue()),
    target.id
  );
  const headerText = `<span class="node-path-header-text">Node <span class="node-type">nodeType</span> | <span class="node-name">Name</span></span>`;
  targetPath.unshift(headerText);
  nodeType.innerHTML = targetPath.join("<br>");
  nodeType.classList.remove("display-none");
}

function removeHighlight() {
  if (mark) mark.clear();
}

function scrollToLine(position) {
  const lineNumber = astEditor.posFromIndex(position).line;
  astEditor.scrollTo(
    null,
    astEditor.charCoords({ line: lineNumber - 1, ch: 0 }, "local").top
  );
}

btn.addEventListener("click", () => {
  const code = editor.getValue();

  const apiUrl = import.meta.env.VITE_API_URL;

  fetch(apiUrl + "/api/getAstCode", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: code }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      if (data.error_message) {
        astEditor.setValue(data.error_message);
        isDirty = true;
        return;
      }
      compiledAst = data.compiled_ast;
      blockIndices = findBlockIndices(compiledAst);
      astEditor.setValue(compiledAst);
      isDirty = false;
      btn.innerText = "Already Compiled";
      btn.classList.remove("dirty");
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

pinButton.addEventListener("click", () => {
  const nodeTreeDisplay =
    document.getElementById("node-tree-display").innerHTML;
  const nodeTreeDisplayPinned = document.getElementById(
    "node-tree-display-pinned"
  );

  if (nodeTreeDisplay.trim() !== "") {
    nodeTreeDisplayPinned.innerHTML = nodeTreeDisplay;
    if (!nodeTreeDisplayPinned.classList.contains("border-left")) {
      nodeTreeDisplayPinned.classList.add("border-left");
    }
  } else {
    nodeTreeDisplayPinned.innerHTML = "";
  }
});

unpinButton.addEventListener("click", () => {
  const nodeTreeDisplayPinned = document.getElementById(
    "node-tree-display-pinned"
  );
  nodeTreeDisplayPinned.innerHTML = "";
  if (nodeTreeDisplayPinned.classList.contains("border-left")) {
    nodeTreeDisplayPinned.classList.remove("border-left");
  }
});
