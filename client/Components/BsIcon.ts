import { createElement } from "helpers";

export default class BsIcon extends HTMLElement {
  static display = "d-inline-flex";
  constructor(_class: string, _size: string) {
    super();

    this.classList.add(BsIcon.display);
    const icon = createElement("i", [["bi", _class].join("-")]);
    icon.style.fontSize = _size;
    this.replaceChildren(icon);
  }
}
