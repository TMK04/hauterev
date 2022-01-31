export default class BsIcon extends HTMLElement {
  constructor(_name = "", _size = "1em") {
    super();

    this.classList.add("d-inline-flex");
    const icon = document.createElement("i");
    const size = this.getAttribute("size") || _size;
    const icon_class = ["bi", this.getAttribute("name") || _name].join("-");
    icon.style.fontSize = size;
    icon.classList.add(icon_class);
    this.replaceChildren(icon);
  }
}
