customElements.define(
  "hr-top-bar",
  class TopBar extends HTMLElement {
    constructor() {
      super();
      this.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="container mx-auto justify-content-around">
            <a class="navbar-brand text-primary h1 mb-0" href="index.html">Hauterev</a>
            <form class="form-inline w-50">
              <div class="input-group">
                <span class="input-group-prepend">
                  <button class="btn btn-outline-secondary border-right-0 border" type="button">
                    <hr-icon src="icons/search.svg" size="24" />
                  </button>
                </span>
                <input class="form-control border-left-0 border" type="search" placeholder="Search" />
              </div>
            </form>
            <button class="btn"><hr-icon src="icons/user.svg" size="28" /></button>
            <button class="btn"><hr-icon src="icons/bookmarked.svg" size="28" /></button>
          </div>
        </nav>`;
    }
  }
);
