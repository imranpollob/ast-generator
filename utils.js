import { astCode } from "./testSourceCode.js";

export function findBlockIndices(code) {
  const blockIndices = [];
  const stack = [];

  for (let i = 0; i < code.length; i++) {
    if (code[i] === "{") {
      stack.push(i);
    } else if (code[i] === "}") {
      if (stack.length > 0) {
        const startIndex = stack.pop();
        const endIndex = i + 1;
        let block = code.slice(startIndex, endIndex);
        block = JSON.parse(block);

        if (block.src) {
          const [numStartIndex, numLength] = block.src
            .split(":", 2)
            .map(Number);
          blockIndices.push({
            start: startIndex,
            end: endIndex,
            codeStart: numStartIndex,
            codeEnd: numStartIndex + numLength,
          });
        }
      }
    }
  }

  // console.log(blockIndices.length);
  console.log("Block indices:", blockIndices);
  return blockIndices;
}

// let blockIndices = findBlockIndices(astCode);
// blockIndices = blockIndices.filter((item) => item.codeStart);
// blockIndices.sort((a, b) => a.end - a.start - (b.end - b.start));

// console.log(blockIndices);
