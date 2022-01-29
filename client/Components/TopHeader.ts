export default class TopHeader extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<h1 class="text-center mt-4 mb-5">${this.getAttribute("text")}</h1>`;
  }
}
