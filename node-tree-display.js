function copyContent() {
  const nodeTreeDisplay =
    document.getElementById("node-tree-display").innerHTML;
  const nodeTreeDisplayPinned = document.getElementById(
    "node-tree-display-pinned"
  );

  if (nodeTreeDisplay.trim() !== "") {
    nodeTreeDisplayPinned.innerHTML = nodeTreeDisplay;
  } else {
    nodeTreeDisplayPinned.innerHTML = "";
  }
}
