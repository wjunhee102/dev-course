function breadcrumb(props) {
    return `
        ${props.map(prop => `
            <div>${prop}</div>
        `).join("")}
    `;
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => 
                typeof child === "object"? 
                child : createTextElement(child)     
            )
        }
    }
}

function render(parentDom, element) {
    if(Array.isArray(element)) {
        element.forEach((ele) => render(parentDom, ele));
    } else {
        const { type, props } = element;

        const $dom = type !== "TEXT_ELEMENT"? document.createElement(type) : document.createTextNode(""); 
        const eventKeyList = [];
        const propsKeyList = [];

        for(const key in props) {
            if(key.startsWith("on")) {
                eventKeyList.push(key);
            } else {   
                propsKeyList.push(key);
            }
        }

        eventKeyList.forEach(key => {
            $dom.addEventListener(key.toLowerCase().substring(2), props[key]);
        });

        propsKeyList.forEach(key => {
            if(key === "style") {
                props[key].forEach(styles => {
                    $dom.style[styles] = props[key][styles];
                });
            } else if(key !== "children"){
                $dom[key] = props[key];
            }
        });

        if(props.children && props.children[0]) {
            props.children.forEach(child => {
                render($dom, child);
            });
        }

        parentDom.appendChild($dom);
    }
}

class App {
    rootDom = null;
    elements = null;
    routes = ["root"];
    breadCrumb = null;
    nodes = null;

    constructor(rootDom, elements) {
        this.rootDom = rootDom;
        this.elements = elements;
        this.breadCrumb = document.createElement("nav");
        this.nodes = document.createElement("div");
        this.nodesRender = this.nodesRender.bind(this);
    }

    breadCrumbRender() {
        this.breadCrumb.innerHTML = breadcrumb(this.routes);
    }

    nodesRender(nodeList) {
        this.nodes.innerHTML = "";
    
        render(this.nodes, this.elements(nodeList));
    }

    render() {
        if(
            this.rootDom instanceof HTMLElement === false
            || !this.elements
        ) return this;

        this.rootDom.appendChild(this.breadCrumb);
        this.rootDom.appendChild(this.nodes);
        this.breadCrumb.className = "Breadcrumb";
        this.nodes.className = "Nodes";

        this.breadCrumbRender();
        this.nodesRender([
            {
                type: DIRECTORY,
                name: "2021/04"
            },
            {
                type: "IMAGE",
                name: "하품하는 사진",
                filePath: "./assets/file.png"
            }
        ]);
    }
}

const DIRECTORY = "DIRECTORY";
const IMAGE_BASE_URL = "https://fe-dev-matching-2021-03-serverlessdeploymentbuck-t3kpj3way537.s3.ap-northeast-2.amazonaws.com/public";

const subscribes = [];

function dispatch(value) {
    subscribes.forEach(sub => sub(value)); 
}

const historyUrlList = [];

async function getData(id) {
  const index = historyUrlList.findIndex(history => history[0] === id);

    if(index !== -1) {
      dispatch(historyUrlList[index][1]);

      return;
    }  
    dispatch();

    const data = await fetch(`https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev/${id}`)

    if(data) historyUrlList.push([id, data.json()]);

    dispatch(data);    
}


function nodes(dataList)  {
    if(!dataList) {
        return createElement("div", {
            className: "loading"
        }, createElement("img", {
            src: "./assets/nyan-cat.gif"
        }));
    }

    return dataList.map(({
            id, name, type, filePath, parent
        }) => createElement("div", {
            className: "Node",
            onClick: () => {
                if(type === DIRECTORY) {
                    getData(id? id : "");
                    if (typeof (history.pushState) != "undefined") { 
                      history.pushState(state, title, url); 
                    }
                }
            }
        }, 
        createElement("img", {
            src: type === DIRECTORY? "./assets/directory.png" :  `${IMAGE_BASE_URL}${filePath}` ,
        }),
        createElement("div", {

        }, name)
    ));
}

const $main = document.querySelector("#App");

const main = new App($main, nodes);

main.render();

subscribes.push(main.nodesRender);


function test() {
  for(let i = 0; i < 100000; i++ ) {
    console.log(i);
  }
}

requestIdleCallback(test);