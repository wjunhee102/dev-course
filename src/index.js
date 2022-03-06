import { URL, API_URL, IMAGE_BASE_URL } from './utils/contants.js';
import Nodes from './components/Nodes.js';
import BreadCrumb from './components/BreadCrumb.js';
import Modal from './components/Modal.js';

async function getNodeDataList(path, set, errorCallback) {
  try {
    const data = await fetch(`${API_URL}${path}`)
                      .then((res) => res.json())
                      .catch(e => new Error(e));
  
    if(set) set(data);
  } catch(e) {
    if(errorCallback) errorCallback(e);
  }

}

class App {
  dom = null;
  nodes = null;
  breadCrumb = null;
  modal = null;
  path = [];
  historyDataMap = new Map();
  isLoadingUrl = `${URL}assets/nyan-cat.gif`;

  constructor(dom) {
    this.dom = dom;
    this.bindMethod();
    this.nodes = new Nodes();
    this.breadCrumb = new BreadCrumb();
    this.modal = new Modal();
    this.setChildrenProps();
  }

  bindMethod() {
    this.setNodeDataList = this.setNodeDataList.bind(this);
    this.moveToDirectory= this.moveToDirectory.bind(this);
    this.moveToTargetDirectory = this.moveToTargetDirectory.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.isLoading = this.isLoading.bind(this);
    this.openImageViewer = this.openImageViewer.bind(this);
    this.openErrorPopup = this.openErrorPopup.bind(this);
  }

  setChildrenProps() {
    if(this.nodes) this.nodes.setProps({ 
      moveToDirectory: this.moveToDirectory, 
      openImageViewer: this.openImageViewer,
      getPathLength: () => this.path.length
    });

    if(this.breadCrumb) this.breadCrumb.setProps({
      getPath: () => this.path,
      moveToTargetDirectory: this.moveToTargetDirectory
    });
  }

  setNodeDataList(data){
    if(this.nodes) this.nodes.setData(data);
  }

  openErrorPopup() {
    if(this.modal) this.modal.render("error 났습니다.", true);
    this.moveToTargetDirectory("root"); 
  }

  pushRoute(path) {
    this.path.push(path);
 
    this.breadCrumb.setPathName();
  }

  popRoute() {
    this.path.pop();
    this.breadCrumb.setPathName();
  }

  callbackFrontMove(id, name) {
    this.pushRoute({ id, name });

    if(this.historyDataMap.has(id)) {
      this.setNodeDataList(this.historyDataMap.get(id));
      this.closeModal();
    } else {
      
      getNodeDataList(id, (data) => {
        this.setNodeDataList(data);
        this.historyDataMap.set(id, data);
        this.closeModal();
      }, (e) => { this.openErrorPopup() });

    }
  }

  callbackBackMove() {
    this.popRoute();

    const id = this.path[0] && this.path[this.path.length - 1].id;

    if(this.historyDataMap.has(id)) {
      this.setNodeDataList(this.historyDataMap.get(id));
    } else if (!id) {
      this.setNodeDataList(this.historyDataMap.get("root"));
    }
    this.closeModal();
  }

  moveToDirectory(id, name) {
    return () => {
      if(!this.nodes) return;
      this.isLoading();

      if(id !== "back") {
        if(name) this.callbackFrontMove(id, name);
      } else {
        this.callbackBackMove();
      }
    }
  }

  moveToTargetDirectory(targetId) {
    return () => {
      const position = this.path.findIndex(({ id }) => id === targetId);
      const pathLength = this.path.length - 1;

      if(position === pathLength) return;

      if(targetId === "root" || position === this.path.length - 1) {
        this.setNodeDataList(this.historyDataMap.get("root"));
        this.path = [];
        this.breadCrumb.setPathName();

        return;
      }
    
      const diffLength = pathLength - position;

      for(let i = 0; i < diffLength - 1; i++) {
        this.path.pop();
      } 

      this.callbackBackMove();
    } 
  }

  openImageViewer(filePath) {
    return () => {
      if(this.modal) this.modal.openModal(`${IMAGE_BASE_URL}${filePath}`, true);
    } 
  }

  closeModal() {
    if(this.modal) this.modal.closeModal();
  }

  isLoading() {
    if(this.modal) this.modal.openModal(this.isLoadingUrl);
  }

  render() {
    if(this.breadCrumb) {
      this.dom.appendChild(this.breadCrumb.getDom());
      this.breadCrumb.render("");
    }
    if(this.nodes) {
      this.dom.appendChild(this.nodes.getDom());
      this.nodes.render("", false);
    }
    if(this.modal) {
      this.dom.appendChild(this.modal.getDom());
      this.isLoading();
    }
    getNodeDataList("", (data) => {
      this.setNodeDataList(data);
      this.historyDataMap.set("root", data);
      this.closeModal();
    }, (e) => { this.openErrorPopup() });
  }

}

const main = new App(document.getElementById("App"));

main.render();
