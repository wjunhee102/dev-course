import { createElement } from "./core.js";

export default class Sample {

  $target = null

  constructor($target) {
      this.$target = $target;

      const $sample = createElement("h1", "테스트입니다.");
      const $sample2 = (children) => createElement("h2", children);
      $sample.className = "sample";

      if($target) $target.appendChild($sample2($sample));
  }

  
}