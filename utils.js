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
  // console.log("Block indices:", blockIndices);
  return blockIndices;
}

export function findParentPathAndNodeType(
  node,
  targetId,
  path = [],
  nodeTypes = []
) {
  if (typeof node === "object") {
    if (node && typeof node === "object" && node.id === targetId) {
      nodeTypes.shift(); // Remove the first item
      let lastNode = `<span class="node-type"> ${node.nodeType} </span>`;
      if ("name" in node) {
        lastNode += ` | <span class="node-name">${node.name}</span>`;
      }
      nodeTypes.push(lastNode);
      return path.map((v, i) => `${v} ${nodeTypes[i] ? nodeTypes[i] : ""}`);
    }

    for (const key in node) {
      let nodeName = "";
      if ("name" in node) {
        nodeName = ` | <span class="node-name">${node.name}</span>`;
      }
      const result = findParentPathAndNodeType(
        node[key],
        targetId,
        [...path, key],
        [
          ...nodeTypes,
          node.nodeType
            ? `<span class="node-type"> ${node.nodeType} </span>` + nodeName
            : "",
        ]
      );
      if (result) {
        return result;
      }
    }
  } else if (Array.isArray(node)) {
    node.forEach((item, index) => {
      const result = findParentPathAndNodeType(
        item,
        targetId,
        [...path, `[${index}]`],
        [...nodeTypes, item.nodeType || ""]
      );
      if (result) {
        return result;
      }
    });
  }
}
