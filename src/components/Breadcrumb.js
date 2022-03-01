export default class Breadcrumb {
  constructor({ $app, initialState, onClick }) {
    this.state = initialState;
    this.$nav = document.createElement("nav");
    this.$nav.className = "Breadcrumb";
    this.$target = document.createElement("ul");
    this.$target.className = "ul";
    this.onClick = onClick;
    $app.appendChild(this.$nav);
    this.$nav.appendChild(this.$target);
    this.render();

    this.$target.addEventListener("click", (e) => {
      const $navItem = e.target.closest(".nav-item");
      if ($navItem) {
        const { index } = $navItem.dataset;
        this.onClick(index ? parseInt(index, 10) : null);
      }
    });
  }
  setState(nextState) {
    this.state = nextState;
    this.render();
  }

  render() {
    this.$target.innerHTML = `
    <li class="nav-item">root</li>${this.state
      .map(
        (node, index) =>
          `<li class="nav-item" data-index="${index}">${node.name}</li>`
      )
      .join("")}`;
  }
}
