import { createElement } from "helpers";

export default class CollectionHeader extends HTMLElement {
  constructor() {
    super();
    this.classList.add("d-flex", "justify-content-center", "mb-4");
    const h2 = createElement("h2");
    h2.innerHTML = this.innerHTML;
    this.replaceChildren(h2);
  }
}
