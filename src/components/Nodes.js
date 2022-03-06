import { DIRECTORY, URL, IMAGE_BASE_URL } from '../utils/contants.js';

class Nodes {
  dom = null;
  props = null;
  nodeDataList = [];

  static createNode({
    name, type, filePath
  }) {
    return `
      <div class="Node">
        <img src="${type === DIRECTORY? `${URL}assets/directory.png` : `${IMAGE_BASE_URL}${filePath}`}">
        <div>${name}</div>
      </div>
    `;
  } 

  constructor() {
    this.dom = document.createElement("div");
    this.dom.className = "Nodes";
  }

  setProps(props) {
    this.props = props;
  }
  
  getDom() {
    return this.dom;
  }

  setNodesEvent() {
    if(!this.props) return;

    const nodeList = document.querySelectorAll(".Node");

    const { moveToDirectory, openImageViewer } = this.props;

    nodeList.forEach((node, idx) => {
      const { id, name, type, filePath } = this.nodeDataList[idx];

      node.addEventListener("click", type === DIRECTORY? moveToDirectory(id, name) : openImageViewer(filePath));
    });
  }

  setBackBtn() {
    if(!this.props) return;
   
    const $backBtn = document.createElement("div");

    $backBtn.className = "Node";
    $backBtn.innerHTML = `<img src="${URL}assets/prev.png">`;

    this.dom.insertBefore($backBtn, this.dom.childNodes[0]);

    $backBtn.addEventListener("click", this.props.moveToDirectory("back"));
  }

  setData(data) {
    this.nodeDataList = data;
    this.render(data.map(Nodes.createNode).join(""));
  }     

  render(template, afterSetting = true) {
    this.dom.innerHTML = template;

    if(afterSetting) {
      this.setNodesEvent();
      if(this.props?.getPathLength()) this.setBackBtn();
    }
  }
}

export default Nodes;