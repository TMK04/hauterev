import { createElement } from "helpers";

export default class BsIcon extends HTMLElement {
  static display = "d-inline-flex";
  constructor(bi: string, size: string) {
    super();

    this.classList.add(BsIcon.display);
    const icon = createElement("i", [`bi-${bi}`]);
    icon.style.fontSize = size;
    this.replaceChildren(icon);
  }
}
