
class Breadcrumb {
  dom = null;
  props = null;

  static createPathElement(path) {
    return `
      <div class="link">
        ${path}
      </div>
    `;
  }

  constructor() {
    this.dom = document.createElement("div");
    this.dom.className = "Breadcrumb";
  }

  setProps(props) {
    this.props = props;
  }

  getDom() {
    return this.dom;
  }

  setEvent() {
    if(!this.props) return;

    const path = this.props.getPath();
    const linkDomList = document.querySelectorAll(".link");
    const rootLink = document.querySelector(".root-link");
    
    linkDomList.forEach((dom, idx) => {
      dom.addEventListener("click", this.props.moveToTargetDirectory(path[idx].id));
    });

    rootLink.addEventListener("click", this.props.moveToTargetDirectory("root"));
  }

  setPathName() {
    if(!this.props) return;

    const path = this.props.getPath();

    const nameList = path[0] && path.map(({name}) => name);

    const url = nameList? nameList.join("/") : "";

    history.pushState(null, null, `/${url}`);

    this.render(nameList? nameList.map(Breadcrumb.createPathElement).join("") : "");
  }

  render(template) {
    this.dom.innerHTML = `<div class="root-link">root</div>${template}`;

    this.setEvent();
  }
}

export default Breadcrumb;