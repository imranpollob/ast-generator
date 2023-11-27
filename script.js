import { editor, astEditor } from "./main";
const btn = document.querySelector("#convertBtn");

btn.addEventListener("click", () => {
  const code = editor.getValue();

  fetch("http://localhost:3000/")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  console.log(code);
});
