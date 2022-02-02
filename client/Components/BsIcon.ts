export default class BsIcon extends HTMLElement {
  constructor(_class: string, _size: string) {
    super();

    this.classList.add("d-inline-flex");
    const icon = document.createElement("i");
    const icon_class = ["bi", _class].join("-");
    icon.style.fontSize = _size;
    icon.classList.add(icon_class);
    this.replaceChildren(icon);
  }
}
