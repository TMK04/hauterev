import { btn } from "helpers";

const endBtn = (src: string) => {
  const b = btn();
  b.classList.add("ms-3");
  b.innerHTML = `<hr-icon src="${src}" size="28"></hr-icon>`;
  return b;
};

customElements.define(
  "hr-top-bar",
  class TopBar extends HTMLElement {
    constructor() {
      super();

      // <nav>
      const nav = document.createElement("nav");
      nav.classList.add("navbar", "navbar-light", "bg-light", "p-0");
      // - <div>
      const nav_div = document.createElement("div");
      nav_div.classList.add("d-flex", "w-75", "mx-auto", "align-items-center");
      // - - <a>
      const brand = document.createElement("a");
      brand.classList.add(
        "navbar-brand",
        "text-center",
        "text-primary",
        "d-flex",
        "justify-content-center",
        "fs-4",
        "fw-bolder",
        "mb-0",
        "me-0",
        "w-25"
      );
      brand.href = "index.html";
      brand.textContent = "Hauterev";
      // - - </a>
      nav_div.append(brand);
      // - - <form>
      const searchbar = document.createElement("form");
      searchbar.classList.add("navbar-form", "w-50", "mx-1");
      // - - - <div>
      const input_group = document.createElement("div");
      input_group.classList.add("input-group");
      // - - - - <button>
      const search_btn = btn();
      search_btn.classList.add(
        "btn-outline-secondary",
        "bg-white",
        "border",
        "border-end-0",
        "rounded-0",
        "ps-1",
        "pe-0",
        "py-0"
      );
      search_btn.type = "submit";
      search_btn.innerHTML += "<hr-icon src='icons/search.svg' size='24' class='mx-3'></hr-icon>";
      // - - - - </button>
      input_group.append(search_btn);
      // - - - - <input />
      const search_input = document.createElement("input");
      search_input.classList.add("form-control", "border", "border-start-0", "rounded-0", "fs-5");
      search_input.type = "search";
      search_input.placeholder = "Search";
      search_input.id = "search_input";
      // - - - </div>
      input_group.append(search_input);
      // - - </form>
      searchbar.append(input_group);
      // - </div>
      nav_div.append(searchbar, endBtn("icons/user.svg"), endBtn("icons/bookmarked.svg"));
      // </nav>
      nav.append(nav_div);
      this.append(nav);

      searchbar.onsubmit = () => {
        let url = "/search.html?";
        const search = search_input.value;
        if (search) url += `search=${search}`;
        location.assign(url);
        // Prevent default
        return false;
      };
    }
  }
);
