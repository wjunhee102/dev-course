

function createNode({
  id, name, type, filePath, parent
}) {
  return `
    <div class="Node">
      <img src="${type ==="DIRECTORY"? "./assets/directory.png" : filePath}">
      <div>${name}</div>
    </div>
  `;
} 

function createPathElement(path) {
  return `
    <div>
      ${path}
    </div>
  `
}

const dummyData = [
  {
    "id": "1",
    "name": "노란고양이",
    "type": "DIRECTORY",
    "filePath": "/src",
    "parent": null
  },
  {
    "id": "3",
    "name": "까만고양이",
    "type": "IMAGE",
    "filePath": null,
    "parent": null
  },
]

const dummyData2 = [
  {
    "id": "1",
    "name": "고양이 아님",
    "type": "DIRECTORY",
    "filePath": "/src",
    "parent": null
  },
  {
    "id": "3",
    "name": "강아지",
    "type": "IMAGE",
    "filePath": null,
    "parent": null
  },
]

async function getNodeDataList(path, set) {
  try {
    const data = await fetch(`https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/${path}`)
                        .then((res) => res.json())
                        .catch(e => new Error(e));
    
    if(set) set(data);
  } catch(e) {

  }

}

class App {
  dom = null;
  nodesDom = null;
  breadCrumbDom = null;
  path = [];
  historyDataMap = new Map();
  nodeDataList = null;
  loadingTemplate = `<div class="Modal Loading">
                      <div class="content">
                        <img src="./assets/nyan-cat.gif">
                      </div>
                    </div>`;

  constructor(dom) {
    this.dom = dom;
    this.nodesDom = document.createElement("div");
    this.breadCrumbDom = document.createElement("div");

    this.nodesDom.className = "Nodes";
    this.breadCrumbDom.className = "Breadcrumb";

    this.dom.appendChild(this.breadCrumbDom);
    this.dom.appendChild(this.nodesDom);

    this.nodeDataList = dummyData;

    this.setNodeDataList = this.setNodeDataList.bind(this);
  }

  setNodeDataList(data){
    this.nodeDataList = data;
    this.nodesRender(this.nodeDataList.map(createNode).join(""));
  }

  setBackBtn() {
    const $backBtn = document.createElement("div");

    $backBtn.className = "Node";
    $backBtn.innerHTML = `
      <img src="./assets/prev.png">
    `;

    this.nodesDom.insertBefore($backBtn, this.nodesDom.childNodes[0]);

    $backBtn.addEventListener("click", () => {
      this.nodesRender(this.loadingTemplate, true);

      this.popRoute();

      const id = this.path[0] && this.path[this.path.length - 1].id;

      if(this.historyDataMap.has(id)) {
        this.setNodeDataList(this.historyDataMap.get(id));
      } else if (!id) {
        this.setNodeDataList(this.historyDataMap.get("root"));
      } else {
        getNodeDataList(id? id : "", this.setNodeDataList);
      }
      
    });
  }

  setNodesEvent() {
    const nodeList = document.querySelectorAll(".Node");

    nodeList.forEach((node, idx) => {
      const { id, name, filePath, type } = this.nodeDataList[idx];

      node.addEventListener("click", () => {
        if(type === "DIRECTORY") {
          this.nodesRender(this.loadingTemplate, true);
 
          this.pushRoute({ id, name });

          if(this.historyDataMap.has(id)) {

            this.setNodeDataList(this.historyDataMap.get(id));
            
          } else {

            getNodeDataList(id, (data) => {
              this.setNodeDataList(data);
              this.historyDataMap.set(id, data);
            });

          }

        } else {
          console.log("이미지 팝업");
        }
      });
    });
    
  
  }

  nodesRender(template, isLoading) {
    this.nodesDom.innerHTML = template;

    if(!isLoading) {
      this.setNodesEvent();
      this.setBackBtn();
    }
  }

  pushRoute(path) {
    this.path.push(path);

    this.setBreadCrumb();
  }

  popRoute() {
    this.path.pop();

    this.setBreadCrumb();
  }

  setBreadCrumb() {
    const nameList = this.path[0] && this.path.map(({name}) => name);

    const url = nameList? nameList.join("/") : "";

    history.pushState(null, null, `/${url}`);

    this.breadCrumbRender(nameList? nameList.map(createPathElement).join("") : "");
  }

  breadCrumbRender(template) {
    this.breadCrumbDom.innerHTML = template;
  }

  render() {
    this.nodesRender(this.loadingTemplate);
    getNodeDataList("", (data) => {
      this.setNodeDataList(data);
      this.historyDataMap.set("root", data);
    });
    this.breadCrumbRender("");
  }

}

const $main = document.getElementById("App");

const main = new App($main);

main.render();
