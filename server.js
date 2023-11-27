import express from "express";
import bodyParser from "body-parser";
import solc from "solc";
import cors from "cors";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

app.post("/api/getAstCode", (req, res) => {
  const solidityCode = req.body;

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

  const the_ast = JSON.parse(solc.compile(JSON.stringify(input))).sources[
    "Test.sol"
  ].ast;

  console.log(the_ast);

  res.json({});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
