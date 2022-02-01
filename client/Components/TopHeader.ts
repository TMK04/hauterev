export default class TopHeader extends HTMLElement {
  constructor() {
    super();
    const h1 = document.createElement("h1");
    h1.classList.add("text-center", "mb-5");
    h1.innerHTML = this.innerHTML;
    this.replaceChildren(h1);

    this.style.marginTop = "42px";
    this.style.marginBottom = "64px";
  }
}
