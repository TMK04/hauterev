import { btn, center_content_classes } from "helpers";

const endBtn = (src: string, name: string) => {
  const div = document.createElement("div");
  div.classList.add("d-flex", ...center_content_classes, "ms-lg-3", "mt-lg-0", "mt-1");
  const b = btn();
  b.innerHTML = `<hr-icon src="${src}" size="28"></hr-icon>`;
  div.append(b);
  const n = document.createElement("a");
  n.classList.add("d-lg-none");
  n.textContent = name;
  div.append(n);
  return div;
};

customElements.define(
  "hr-top-bar",
  class TopBar extends HTMLElement {
    constructor() {
      super();

      // <nav>
      const nav = document.createElement("nav");
      nav.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light", "p-0");
      // - <div>
      const nav_div = document.createElement("div");
      nav_div.classList.add(
        "d-flex",
        "flex-lg-row",
        "flex-column",
        "w-75",
        "mx-auto",
        "my-lg-0",
        "my-3",
        ...center_content_classes
      );
      // - - <div>
      const no_collapse = document.createElement("div");
      no_collapse.classList.add("d-flex", "w-25", ...center_content_classes);
      // - - - <a>
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
        "mx-lg-0",
        "mx-5",
        "w-25"
      );
      brand.href = "index.html";
      brand.textContent = "Hauterev";
      // - - - </a>
      no_collapse.append(brand);
      // - - - <button>
      const toggler = document.createElement("button");
      toggler.classList.add("navbar-toggler", "d-lg-none");
      toggler.type = "button";
      toggler.setAttribute("data-bs-toggle", "collapse");
      toggler.setAttribute("data-bs-target", "#top-bar-collapse");
      // - - - - <i>
      const toggler_icon = document.createElement("i");
      toggler_icon.classList.add("navbar-toggler-icon");
      // - - - - </i>
      toggler.append(toggler_icon);
      // - - - </button>
      no_collapse.append(toggler);
      // - - </div>
      nav_div.append(no_collapse);
      // - - <div>
      const collapse = document.createElement("div");
      collapse.classList.add("collapse", "navbar-collapse", "w-75");
      collapse.id = "top-bar-collapse";
      // - - - <form>
      const searchbar = document.createElement("form");
      searchbar.classList.add("container-fluid", "navbar-form", "mx-1", "my-lg-0", "my-2");
      // - - - - <div>
      const input_group = document.createElement("div");
      input_group.classList.add("input-group");
      // - - - - - <button>
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
      // - - - - - </button>
      input_group.append(search_btn);
      // - - - - - <input />
      const search_input = document.createElement("input");
      search_input.classList.add("form-control", "border", "border-start-0", "rounded-0", "fs-5");
      search_input.type = "search";
      search_input.placeholder = "Search";
      search_input.id = "search_input";
      input_group.append(search_input);
      // - - - - </div>
      searchbar.append(input_group);
      // - - - </form>
      collapse.append(
        searchbar,
        endBtn("icons/user.svg", "Profile"),
        endBtn("icons/bookmarked.svg", "Bookmarks")
      );
      // - - </div>
      nav_div.append(collapse);
      // - </div>
      nav.append(nav_div);
      // </nav>
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
