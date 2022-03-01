export default class Loading {
  constructor({ $app, initialState }) {
    this.state = initialState;
    this.$target = document.createElement("div");
    this.$target.className = "Loading Modal";
    $app.appendChild(this.$target);
    this.render();
  }
  setState(nextState) {
    this.state = nextState;
    this.render();
  }
  render() {
    this.$target.innerHTML = `<div className="content"><img src="../assets/nyan-cat.gif" alt="" /></div>`;
    this.$target.style.display = this.state ? "block" : "none";
  }
}
