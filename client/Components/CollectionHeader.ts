export default class CollectionHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<h2 class="text-center mb-4">${this.getAttribute("text")}</h2>`;
  }
}
