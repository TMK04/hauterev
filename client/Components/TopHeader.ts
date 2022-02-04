import { createElement } from "helpers";

export default class TopHeader extends HTMLElement {
  readonly top_header: HTMLHeadingElement;

  constructor() {
    super();

    this.top_header = createElement("h1", ["text-center", "mb-5"]);
    this.top_header.innerHTML = this.innerHTML;
    this.replaceChildren(this.top_header);
  }
}
