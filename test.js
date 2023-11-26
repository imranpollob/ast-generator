const code = `{
          "constant": true,
          "id": 4,
          "mutability": "constant",
          "name": "WEEK",
          "nameLocation": "98:4:0",
          "nodeType": "VariableDeclaration",
          "scope": 14,
          "src": "81:30:0",
          "stateVariable": true,
          "storageLocation": "default",
          "typeDescriptions": { "typeIdentifier": "t_uint256", "typeString": "uint256" },
          "typeName": {
            "id": 2,
            "name": "uint256",
            "nodeType": "ElementaryTypeName",
            "src": "81:7:0",
            "typeDescriptions": { "typeIdentifier": "t_uint256", "typeString": "uint256" }
          },
          "value": {
            "hexValue": "363034383030",
            "id": 3,
            "isConstant": false,
            "isLValue": false,
            "isPure": true,
            "kind": "number",
            "lValueRequested": false,
            "nodeType": "Literal",
            "src": "105:6:0",
            "typeDescriptions": { "typeIdentifier": "t_rational_604800_by_1", "typeString": "int_const 604800" },
            "value": "604800"
          },
          "visibility": "internal"
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
