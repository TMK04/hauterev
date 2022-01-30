export default class Icon extends HTMLElement {
  constructor(src = "", length = 0) {
    super();

    const img = document.createElement("img");
    const l = +(<string>this.getAttribute("l")) || length;
    img.width = l;
    img.height = l;
    img.src = `icons/${this.getAttribute("src") || src}`;
    this.replaceChildren(img);
  }
}
