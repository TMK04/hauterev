import type AsyncInit from "./AsyncInit";

import { center_content_classes, createElement, selectCustomElement } from "helpers";

import ResCollection from "./ResCollection";
import ResFilters from "./ResFilters";
import RevCollection from "./RevCollection";

export default class ResRevSwitch extends HTMLElement implements AsyncInit {
  static d_none = "d-none";

  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    this.classList.add("d-flex", ...center_content_classes, "mb-4");

    // <button>
    const res = createElement("button", ["btn", "my-auto"]);
    res.textContent = "Restaurants";
    // </button>
    this.append(res);
    // <span>
    const divider = createElement("span", ["fs-2"]);
    divider.textContent = "/";
    // </span>
    this.append(divider);
    // <button>
    const rev = createElement("button", ["btn", "my-auto"]);
    rev.textContent = "Reviews";
    // </button>
    this.append(rev);

    const res_filters = <ResFilters>selectCustomElement("ResFilters");
    const res_collection = <ResCollection>selectCustomElement("ResCollection");
    const rev_collection = <RevCollection>selectCustomElement("RevCollection");

    const useRes = () => {
      res.classList.remove("fs-3", "text-secondary");
      res.classList.add("fs-2", "text-dark");
      rev.classList.remove("fs-2", "text-dark");
      rev.classList.add("fs-3", "text-secondary");
      res_filters.classList.add(ResFilters.display);
      res_filters.classList.remove(ResRevSwitch.d_none);
      res_collection.classList.add(ResCollection.display);
      res_collection.classList.remove(ResRevSwitch.d_none);
      rev_collection.classList.add(ResRevSwitch.d_none);
      rev_collection.classList.remove(RevCollection.display);
    };
    res.addEventListener("click", useRes);
    const useRev = () => {
      rev.classList.remove("fs-3", "text-secondary");
      rev.classList.add("fs-2", "text-dark");
      res.classList.remove("fs-2", "text-dark");
      res.classList.add("fs-3", "text-secondary");
      rev_collection.classList.add(RevCollection.display);
      rev_collection.classList.remove(ResRevSwitch.d_none);
      res_filters.classList.add(ResRevSwitch.d_none);
      res_filters.classList.remove(ResFilters.display);
      res_collection.classList.add(ResRevSwitch.d_none);
      res_collection.classList.remove(ResCollection.display);
    };
    rev.addEventListener("click", useRev);

    useRes();
  };
}
