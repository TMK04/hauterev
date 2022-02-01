export default class CollectionHeader extends HTMLElement {
  constructor() {
    super();
    const h2 = document.createElement("h2");
    h2.classList.add("text-center", "mb-4");
    h2.innerHTML = this.innerHTML;
    this.replaceChildren(h2);

    this.style.marginBottom = "36px";
  }
}
