import elementsList from './elements.js';

const { div, createElements } = elementsList;

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
        console.log($dom);
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
                    console.log(name);
                }
            }, 
            createElement("img", {
                src: type === DIRECTORY? "./assets/directory.png" :  filePath ,
            }),
            createElement("div", {

            }, name)
            ));
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
    }

    async getData() {
        this.nodesRender();

        const data = await fetch("https://zl3m4qq0l9.execute-api.ap-northeast-2.amazonaws.com/dev").then((res) => {
            return res.json()
        }).catch((error) => {
            return res.error()
        });

        this.nodesRender(data);
    }

    breadCrumbRender() {
        this.breadCrumb.innerHTML = breadcrumb(this.routes);
    }

    nodesRender(nodeList) {
        this.nodes.innerHTML = "";
    
        render(this.nodes, nodes(nodeList));
    }

    render() {
        if(
            this.rootDom instanceof HTMLElement === false
            || !this.elements
        ) return this;
            console.log(this.rootDom, this.breadCrumb);

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

        /**
         * TODO Event
         */
    }
}

let count = 1;
function setCount(value) {
    count = value;
    main.render();
    console.log(count);
}

function CountComponent() {
    return div([count, []], {
        className: "count",
        eventList: [
            {
                className: "count",
                type: "click",
                callback: () => setCount(count + 1)
            }
        ]
    })
}

[
    {
          "id": "1",
          "name": "노란고양이",
          "type": "DIRECTORY",
          "filePath": null,
          "parent": null
      },
      {
          "id": "3",
          "name": "까만고양이",
          "type": "DIRECTORY",
          "filePath": null,
          "parent": null
      }
  ]

  const DIRECTORY = "DIRECTORY";



const $main = document.querySelector(".App");

const main = new App($main, CountComponent);

main.render();

main.getData();