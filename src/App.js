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
  eventList = [];

  constructor(elements, $target) {
    this.$target = $target;
    this.elements = elements;
    this.setState = this.setState.bind(this);
    this.setEventList = this.setEventList.bind(this);
  }

  setState(value) {
    this.state = value;
    this.render();
  }

  setEventList(event) {
    this.eventList.push(event);
  }

  render() {
    if(this.$target instanceof HTMLElement && this.elements) this.$target.appendChild(this.elements(this.state, this.setState, this.setEventList));

    if(this.eventList[0]) {
      for(const { className, type, callback } of this.eventList) {
        const $dom = document.querySelector(`.${className}`);

        if($dom instanceof HTMLElement) {
          $dom.addEventListener(type, callback);
        }

      }
    }
  }
}


`<div>
</div>`