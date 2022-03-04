
function div(className, elements) {
  return `<div class=${className}>${elements}</div>`;
}

function ul(className, elements) {
  return `<ul class=${className}>${elements}</ul>`;
}

function li(className, elements) {
  return `<li class=${className}>${elements}</li>`;
}




class App {
  rootDom;
  elements;

  constructor(rootDom, elements) {
    this.rootDom = rootDom;
    this.elements = elements;
  }

  render() {
    if(this.rootDom instanceof HTMLElement === false) return this;

    this.rootDom.innerHTML = this.elements;
  }
}

