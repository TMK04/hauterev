import type AsyncInit from "./AsyncInit";

import { btn, center_content_classes, whenDefined } from "helpers";

import BsIcon from "./BsIcon";

export default class TopBar extends HTMLElement implements AsyncInit {
  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    this.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light", "p-0", "mb-4");
    // <div>
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
    // - <div>
    const no_collapse = document.createElement("div");
    no_collapse.classList.add("d-flex", "w-25", ...center_content_classes);
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
      "mx-lg-0",
      "mx-5",
      "w-25"
    );
    brand.href = "index.html";
    brand.textContent = "Hauterev";
    // - - </a>
    no_collapse.append(brand);
    // - - <button>
    const toggler = document.createElement("button");
    toggler.classList.add("navbar-toggler", "d-lg-none");
    toggler.type = "button";
    toggler.setAttribute("data-bs-toggle", "collapse");
    toggler.setAttribute("data-bs-target", "#top-bar-collapse");
    // - - - <i>
    const toggler_icon = document.createElement("i");
    toggler_icon.classList.add("navbar-toggler-icon");
    // - - - </i>
    toggler.append(toggler_icon);
    // - - - </button>
    no_collapse.append(toggler);
    // - </div>
    nav_div.append(no_collapse);
    // - <div>
    const collapse = document.createElement("div");
    collapse.classList.add("collapse", "navbar-collapse", "w-75");
    collapse.id = "top-bar-collapse";
    // - - <form>
    const searchbar = document.createElement("form");
    searchbar.classList.add("container-fluid", "navbar-form", "mx-1", "my-lg-0", "my-2");
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
      "d-flex",
      "align-items-center",
      "ps-1",
      "pe-0",
      "py-0"
    );
    search_btn.type = "submit";
    await whenDefined("BsIcon");
    const search_icon = new BsIcon("search", "24px");
    search_icon.classList.add("mx-3", "text-dark");
    search_btn.append(search_icon);
    // - - - - </button>
    input_group.append(search_btn);
    // - - - - <input />
    const search_input = document.createElement("input");
    search_input.classList.add("form-control", "border", "border-start-0", "rounded-0", "fs-5");
    search_input.type = "search";
    search_input.placeholder = "Search";
    search_input.id = "search-input";
    input_group.append(search_input);
    // - - - </div>
    searchbar.append(input_group);
    // - - - </form>
    collapse.append(
      searchbar,
      TopBar.TopBarLink("box-arrow-in-right", "/logsig.html", "Login / Sign-up", "logsig")
    );
    // - - </div>
    nav_div.append(collapse);
    // - </div>
    nav_div.append(collapse);
    // </div>
    this.append(nav_div);

    searchbar.addEventListener("submit", (ev) => {
      let url = "/search.html?";
      const search = search_input.value;
      if (search) url += `search=${search}`;
      location.assign(url);
      ev.preventDefault();
    });
  };

  static TopBarLink = (icon_name: string, href: string, name: string, id: string) => {
    id = `top-bar-${id}`;

    // <a>
    const link = document.createElement("a");
    link.classList.add("d-flex", ...center_content_classes, "ms-lg-3", "mt-lg-0", "mt-1");
    link.href = href;
    // - <button>
    const b = btn();
    // - - <img />
    const icon = new BsIcon(icon_name, "28px");
    b.append(icon);
    b.id = id;
    // - </button>
    link.append(b);
    // - <label>
    const label = document.createElement("label");
    label.classList.add("d-lg-none", "fw-bold");
    label.textContent = name;
    label.htmlFor = id;
    // - </label>
    link.append(label);
    // </a>
    return link;
  };
}
