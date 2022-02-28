export default class Node {
  constructor({ $app, initialState, onClick }) {
    this.state = initialState;
    this.$target = document.createElement("ul");
    this.onClick = onClick;
    $app.appendChild(this.$target);
    this.render();
  }
  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    if (this.state.nodes) {
      const nodesTemplate = this.state.nodes
        .map((node) => {
          const iconPath =
            node.type === "FILE"
              ? "./assets/file.png"
              : "./assets/directory.png";
          return `
          <li class="Node" data-node-id="${node.id}">
          <img src="${iconPath}" />
          <p>${node.name}</p>
        </li>
        `;
        })
        .join("");
      this.$target.innerHTML = !this.state.isRoot
        ? `<li class="Node"><img src="/assets/prev.png"></li>${nodesTemplate}`
        : nodesTemplate;
    }
    this.$target.querySelectorAll(".Node").forEach(($node) => {
      $node.addEventListener("click", () => {
        const { nodeId } = $node.dataset;

        const selectedNode = this.state.nodes.find(
          (node) => node.id === nodeId
        );
        console.log(selectedNode, "selectedNode");
        console.log(nodeId, "nodeId");
        if (selectedNode) {
          this.onClick(selectedNode);
        }
      });
    });
  }
}
