customElements.define(
  "hr-icon",
  class Icon extends HTMLElement {
    constructor() {
      super();

      const src = this.getAttribute("src");
      if (!src) return;
      const size = +(this.getAttribute("size") || 0);

      this.innerHTML = `<img src="${src}" width="${size}" height="${size}" />`;
    }
  }
);
