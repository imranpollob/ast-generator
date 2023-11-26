import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/theme/monokai.css";
import "codemirror/addon/display/autorefresh";
import "codemirror/addon/scroll/simplescrollbars";
import "codemirror/addon/scroll/simplescrollbars.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";

import { code, jscode, ast } from "./testSourceCode.js";

// Create a textarea element to be used as the CodeMirror editor
const textarea = document.createElement("textarea");
document.body.appendChild(textarea);

// Initialize CodeMirror with the textarea element
const editor = CodeMirror(document.querySelector("#editor"), {
  lineNumbers: true, // Enable line number functionality
  value: jscode, // Set the editor content
  mode: "javascript", // Set the language mode to JavaScript
  theme: "monokai", // Set the editor theme
  lineWrapping: true, // Enable line wrapping
  foldGutter: true, // Enable code folding
  gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"], // Add fold gutter
});

// Add cursorActivity event to print cursor current position
editor.on("cursorActivity", function () {
  const cursor = editor.getCursor();
  console.log("Cursor position: ", cursor);
});
