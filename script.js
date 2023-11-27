import { editor, astEditor } from "./main";
const btn = document.querySelector("#convertBtn");

btn.addEventListener("click", () => {
  const code = editor.getValue();

  fetch("http://localhost:3000/api/getAstCode", {
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
      console.log(data);
      astEditor.setValue(data.compiled_ast);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
