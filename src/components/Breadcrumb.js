export default class Breadcrumb {
  constructor({ $app, initialState }) {
    this.state = initialState; //state가 depth인거임
    this.$nav = document.createElement("nav"); // nav 바를 만들고
    this.$nav.className = "Breadcrumb"; // nav className 설정
    this.$target = document.createElement("ul");
    this.$target.className = "ul";
    $app.appendChild(this.$nav); // 이게 트리관계를 생성해줌
    this.$nav.appendChild(this.$target);
    this.render();
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
