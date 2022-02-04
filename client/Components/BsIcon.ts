import { createElement } from "helpers";

export default class BsIcon extends HTMLElement {
  constructor(_class: string, _size: string) {
    super();

    this.classList.add("d-inline-flex");
    const icon = createElement("i", [["bi", _class].join("-")]);
    icon.style.fontSize = _size;
    this.replaceChildren(icon);
  }
}
