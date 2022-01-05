const template = document.createElement("template");
template.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container mx-auto">
      <a class="navbar-brand" href="#">Hauterev</a>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </nav>`;

class NavBar extends HTMLElement {
  constructor() {
    super();
    this.appendChild(template.content.cloneNode(true));
  }
}

customElements.define("nav-bar", NavBar);
