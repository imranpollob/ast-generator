const code = `{
  "absolutePath": "Test.sol",
  "exportedSymbols": { "Test": [14] },
  "id": 15,
  "license": "MIT",
  "nodeType": "SourceUnit",
  "nodes": [
    { "id": 1, "literals": ["solidity", "^", "0.8", ".0"], "nodeType": "PragmaDirective", "src": "33:23:0" },
    {
      "abstract": false,
      "baseContracts": [],
      "canonicalName": "Test",
      "contractDependencies": [],
      "contractKind": "contract",
      "fullyImplemented": true,
      "id": 14,
      "linearizedBaseContracts": [14],
      "name": "Test",
      "nameLocation": "69:4:0",
      "nodeType": "ContractDefinition",
      "scope": 15,
      "src": "60:191:0",
      "usedErrors": []
    }
  ],
  "src": "33:220:0"
}`;

function findLineNumber(code, searchString) {
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(searchString)) {
      return i + 1; // Adding 1 to convert from zero-based index to line number
    }
  }
  return -1; // Return -1 if the searchString is not found
}

function findBlockIndices(code) {
  const blockIndices = [];
  const stack = [];
  let stackSrc = [];

  for (let i = 0; i < code.length; i++) {
    if (code[i] === "{") {
      stack.push(i);
    } else if (code.slice(i, i + 6) === '"src":') {
      const startIndex = code.indexOf('"', i + 7);
      const endIndex = code.indexOf('"', startIndex + 1);
      stackSrc = code
        .slice(startIndex + 1, endIndex)
        .split(":", 2)
        .map(Number);
      // console.log(stackSrc);
    } else if (code[i] === "}") {
      if (stack.length > 0) {
        const startIndex = stack.pop();
        const endIndex = i;
        let numStartIndex = stackSrc[0];
        const numLength = stackSrc[1];
        console.log(numStartIndex, numLength);

        stackSrc = [];
        blockIndices.push({
          start: startIndex,
          end: endIndex,
          codeStart: numStartIndex,
          codeEnd: numStartIndex + numLength,
        });
      }
    }
  }

  return blockIndices;
}

const blockIndices = findBlockIndices(code);
console.log(blockIndices);

// blockIndices.sort((a, b) => a.end - a.start - (b.end - b.start));

// console.log(blockIndices);
