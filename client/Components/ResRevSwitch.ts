import type AsyncInit from "./AsyncInit";

import { center_content_classes, selectCustomElement } from "helpers";

import ResCollection from "./ResCollection";
import ResFilters from "./ResFilters";

export default class ResRevSwitch extends HTMLElement implements AsyncInit {
  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    this.classList.add("d-flex", ...center_content_classes, "mb-4");

    // <button>
    const res = document.createElement("button");
    res.classList.add("btn", "my-auto");
    res.textContent = "Restaurants";
    // </button>
    this.append(res);
    // <span>
    const divider = document.createElement("span");
    divider.classList.add("fs-2");
    divider.textContent = "/";
    // </span>
    this.append(divider);
    // <button>
    const rev = document.createElement("button");
    rev.classList.add("btn", "my-auto");
    rev.textContent = "Reviews";
    // </button>
    this.append(rev);

    const res_filters = <ResFilters>selectCustomElement("ResFilters");
    const res_collection = <ResCollection>selectCustomElement("ResCollection");

    const useRes = () => {
      res.classList.remove("fs-3", "text-secondary");
      res.classList.add("fs-2", "text-dark");
      rev.classList.remove("fs-2", "text-dark");
      rev.classList.add("fs-3", "text-secondary");
      res_filters.classList.replace("d-none", ResFilters.display);
      res_collection.classList.replace("d-none", ResCollection.display);
    };
    res.addEventListener("click", useRes);
    const useRev = () => {
      rev.classList.remove("fs-3", "text-secondary");
      rev.classList.add("fs-2", "text-dark");
      res.classList.remove("fs-2", "text-dark");
      res.classList.add("fs-3", "text-secondary");
      res_filters.classList.replace(ResFilters.display, "d-none");
      res_collection.classList.replace(ResCollection.display, "d-none");
    };
    rev.addEventListener("click", useRev);

    useRes();
  };
}
