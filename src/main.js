import App from "./App.js";
import { createElement } from "./core.js";

function Sample(state, setState, setEventList) {

  const handleClick = () => {
    setState(state + 1);
  }

  setEventList({
    className: "sample",
    type: "click",
    callback: handleClick
  });

  return createElement("h1", state, {
    className: "sample",
    style: { 
      backgroundColor: "#f0f",
      color: "#fff"
    }
  });
}

const app = new App(Sample, document.getElementById("App"));
app.render();
