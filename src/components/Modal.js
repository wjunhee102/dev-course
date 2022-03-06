

class Modal {
  dom = null;

  static createElement(url) {
    return `
      <div class="content">
        <img src="${url}" />
      </div>
    `
  }

  constructor() {
    this.dom = document.createElement("div");
    this.closeModal = this.closeModal.bind(this);
    this.dom.className = "hidden";

    this.setEvent();
  }

  getDom() {
    return this.dom;
  }

  closeModal() {
    this.dom.className = "hidden";
  }

  setEvent() {
    this.dom.addEventListener("click", () => { 
      if(this.dom.className === "Modal ImageViewer") this.closeModal();
     });
  }

  openModal(url, image) {
    this.render(Modal.createElement(url), image);
  }

  render(template, image) {
    this.dom.className = `Modal ${image? "ImageViewer" : "Loading"}`;
    this.dom.innerHTML = template;
  }

}

export default Modal;