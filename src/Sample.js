export default class Sample {
  $target = null;

  constructor($target) {
    this.$target = $target;

    const $h1 = document.createElement("h1");
    $h1.innerText = "샘플 프로젝트2";
    if ($target) $target.appendChild($h1);
  }
}
