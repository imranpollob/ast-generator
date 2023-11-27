import express from "express";
import solc from "solc";
import cors from "cors";
import prettier from "prettier";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
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
