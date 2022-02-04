import type AsyncInit from "./AsyncInit";

import { center_content_classes, createElement, whenDefined } from "helpers";

import BsIcon from "./BsIcon";
import LogSig from "./LogSig";

export default class TopBar extends HTMLElement implements AsyncInit {
  static prefix = "top-bar";

  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    this.classList.add("navbar", "navbar-expand-lg", "navbar-light", "bg-light", "p-0", "mb-4");
    // <div>
    const nav_div = createElement("div", [
      "d-flex",
      "flex-lg-row",
      "flex-column",
      "w-75",
      "mx-auto",
      "my-lg-0",
      "my-3",
      ...center_content_classes
    ]);
    // - <div>
    const no_collapse = createElement("div", ["d-flex", "w-25", ...center_content_classes]);
    // - - <a>
    const brand = createElement("a", [
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
    ]);
    brand.href = "index.html";
    brand.textContent = "Hauterev";
    // - - </a>
    no_collapse.append(brand);
    // - - <button>
    const toggler = createElement("button", ["navbar-toggler", "d-lg-none"]);
    toggler.type = "button";
    toggler.setAttribute("data-bs-toggle", "collapse");
    // - - - <i>
    const toggler_icon = createElement("i", ["navbar-toggler-icon"]);
    // - - - </i>
    toggler.append(toggler_icon);
    // - - - </button>
    no_collapse.append(toggler);
    // - </div>
    nav_div.append(no_collapse);
    // - <div>
    const collapse = createElement("div", [
      "collapse",
      "navbar-collapse",
      "w-75",
      `${TopBar.prefix}-collapse`
    ]);
    toggler.setAttribute("data-bs-target", collapse.id);
    // - - <form>
    const searchbar = createElement("form", [
      "container-fluid",
      "navbar-form",
      "mx-1",
      "my-lg-0",
      "my-2"
    ]);
    // - - - <div>
    const input_group = createElement("div", ["input-group"]);
    // - - - - <button>
    const search_btn = createElement("button", [
      "btn",
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
    ]);
    search_btn.type = "submit";
    await whenDefined("BsIcon");
    const search_icon = new BsIcon("search", "24px");
    search_icon.classList.add("mx-3", "text-dark");
    search_btn.append(search_icon);
    // - - - - </button>
    input_group.append(search_btn);
    // - - - - <input />
    const search_input = createElement(
      "input",
      ["form-control", "border", "border-start-0", "rounded-0", "fs-5"],
      "search-input"
    );
    search_input.type = "search";
    search_input.placeholder = "Search";
    input_group.append(search_input);
    // - - - </div>
    searchbar.append(input_group);
    // - - - </form>
    collapse.append(searchbar);
    // - - - <a>
    await whenDefined("LogSig");
    const logsig = new LogSig();
    const logsig_toggle = TopBar.TopBarLink(
      "box-arrow-in-right",
      `#${LogSig.id}`,
      "Login / Sign-up",
      LogSig.id
    );
    logsig_toggle.setAttribute("data-bs-toggle", "modal");
    // - - - </a>
    collapse.append(logsig_toggle, logsig);
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
    // <a>
    const link = createElement("a", [
      "d-flex",
      ...center_content_classes,
      "ms-lg-3",
      "mt-lg-0",
      "mt-1"
    ]);
    link.href = href;
    // - <button>
    const b = createElement("button", ["btn"]);
    // - - <img />
    const icon = new BsIcon(icon_name, "28px");
    b.append(icon);
    b.id = `${TopBar.prefix}-${id}`;
    // - </button>
    link.append(b);
    // - <label>
    const label = createElement("label", ["d-lg-none", "fw-bold"]);
    label.textContent = name;
    label.htmlFor = b.id;
    // - </label>
    link.append(label);
    // </a>
    return link;
  };
}
