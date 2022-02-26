import { createElement } from "./core.js";

/**
 * 
 * {
      className: "sample",
      type: "click",
      callback: Function
    }
 * 
 */

export default class App {
  $target = null;
  elements = null;
  state = 0;

  constructor(elements, $target) {
    this.$target = $target;
    this.elements = elements;

    console.log(this);
  }

  setState(value) {
    this.state = value;
    this.render();
  }

  render() {
    const state = 0;
    const eventList = [];

    const setEventList = (event) => {
      eventList.push(event);
    }

    const setState =  function(value){
      state = value;
    }

    if(this.$target instanceof HTMLElement && this.elements) this.$target.appendChild(this.elements(this.state, setState, setEventList));

    this.setState(state);

    if(eventList[0]) {
      for(const { className, type, callback } of eventList) {
        console.log(className);
        const $dom = document.querySelector(`.${className}`);

        if($dom instanceof HTMLElement) {
          $dom.removeEventListener(type);
          $dom.addEventListener(type, callback);
        }

      }
    }
  }
}


`<div>
</div>`