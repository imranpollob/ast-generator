import express from "express";
import solc from "solc";
import cors from "cors";
import prettier from "prettier";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use(express.static("dist"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/api/getAstCode", async (req, res) => {
  const solidityCode = req.body.code;

  var input = {
    language: "Solidity",
    sources: {
      "Test.sol": {
        content: solidityCode,
      },
    },
    settings: {
      outputSelection: { "*": { "": ["ast"] } },
    },
  };

  try {
    let the_ast = JSON.parse(solc.compile(JSON.stringify(input))).sources[
      "Test.sol"
    ].ast;

    the_ast = await prettier.format(JSON.stringify(the_ast), {
      parser: "json",
    });

    res.json({ compiled_ast: the_ast });
  } catch (error) {
    res.json({ error_message: "Compilation error!" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
