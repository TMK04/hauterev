import { createElement } from "helpers";

export default class CollectionHeader extends HTMLElement {
  constructor(inner?: string) {
    super();
    this.classList.add("d-flex", "justify-content-center", "mb-4");
    const h2 = createElement("h2");
    h2.innerHTML = inner || this.innerHTML;
    this.replaceChildren(h2);
  }
}
