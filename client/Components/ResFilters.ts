import type AsyncInit from "./AsyncInit";
import type Input from "./Input";
import type ResCollection from "./ResCollection";

import { center_content_classes, whenDefined } from "helpers";

import BsIcon from "./BsIcon";
import OpeningHoursInput from "./OpeningHoursInput";
import RatingInput from "./RatingInput";
import RegionsInput from "./RegionsInput";
import SortInput from "./SortInput";

type TogglerType = HTMLButtonElement;
type DropdownType = HTMLDivElement;
interface ActiveGroup {
  toggler: TogglerType;
  dropdown: DropdownType;
}

export default class ResFilters extends HTMLElement implements AsyncInit {
  #active: ActiveGroup | undefined;
  #min_rating = 0;
  #opening_hours = 16777215;
  #regions = ["North", "South", "East", "West", "Central"];
  #collection = <ResCollection>document.querySelector("hr-res-collection");

  constructor() {
    super();

    this.#init();
  }

  #init = async () => {
    await whenDefined("RatingInput");
    const min_rating = new RatingInput((min_rating) => {
      this.#min_rating = min_rating;
      this.#filter();
    });
    await whenDefined("OpeningHoursInput");
    const opening_hours = new OpeningHoursInput((min, max) => {
      this.#opening_hours = parseInt(
        `${"0".repeat(min)}${"1".repeat(max - min + 1)}${"0".repeat(OpeningHoursInput.max - max)}`,
        2
      );
      this.#filter();
    });
    await whenDefined("RegionsInput");
    const regions = new RegionsInput(this.#regions, (regions) => {
      this.#regions = regions;
      this.#filter();
    });
    await whenDefined("SortInput");
    const sort = new SortInput([]);

    const options: [string, string, string, Input][] = [
      ["min-rating", "star-half", "Min. Rating", min_rating],
      ["opening-hours", "clock-history", "Opening Hours", opening_hours],
      ["regions", "geo-fill", "Regions", regions],
      ["sort-by", "sort-down", "Sort by", sort]
    ];

    this.classList.add("d-block", "container", "justify-content-center", "mx-auto", "mb-4");
    // <div> * 2
    const togglers_row = ResFilters.Row();
    const dropdowns_row = ResFilters.Row();
    await whenDefined("BsIcon");
    for (const [id, src, name, inner] of options) {
      const toggler = ResFilters.Toggler(id, src, name);
      const dropdown = ResFilters.Dropdown(id, inner);
      toggler.addEventListener("click", () =>
        this.active?.toggler === toggler
          ? (this.active = undefined)
          : (this.active = { toggler, dropdown })
      );
      togglers_row.append(toggler);
      dropdowns_row.append(dropdown);
    }
    // </div> * 2
    this.append(togglers_row, dropdowns_row);
  };

  #filter = () => {
    for (const card of <HTMLCollectionOf<HTMLDivElement>>(
      this.#collection.getElementsByClassName("card")
    )) {
      const { avgRating, openingHours, region } = <
        Record<"avgRating" | "openingHours" | "region", string>
      >card.dataset;
      if (this.#min_rating && !(+avgRating >= this.#min_rating)) card.classList.add("d-none");
      else if ((this.#opening_hours & +openingHours) === 0) card.classList.add("d-none");
      else if (!this.#regions.includes(region)) card.classList.add("d-none");
      else card.classList.remove("d-none");
    }
  };

  #deactivate = () => {
    if (this.#active) {
      const { toggler, dropdown } = this.#active;
      toggler.classList.remove("border-primary", "border-2");
      toggler.classList.add("btn-light", "border-secondary");
      dropdown.classList.remove("show");
    }
  };

  get active() {
    return this.#active;
  }

  set active(active: ActiveGroup | undefined) {
    this.#deactivate();
    if (active) {
      const { toggler, dropdown } = active;
      toggler.classList.remove("btn-light", "border-secondary");
      toggler.classList.add("border-primary", "border-2");
      dropdown.classList.add("show");
    }
    this.#active = active;
  }

  static Row = () => {
    const row = document.createElement("div");
    row.classList.add("row", "w-100", "mx-0");
    return row;
  };

  static Toggler = (id: string, icon_name: string, name: string) => {
    id = `filter-toggler-${id}`;

    // <div>
    const toggler = document.createElement("button");
    toggler.classList.add(
      "col-md",
      "btn",
      "btn-light",
      "border",
      "border-secondary",
      "rounded-0",
      "d-flex",
      "justify-content-between",
      "align-items-center",
      "px-3",
      "py-2"
    );
    toggler.id = id;
    // - <div>
    const start = document.createElement("div");
    start.classList.add("d-flex", "w-100", "justify-content-md-start", ...center_content_classes);
    // - - <hr-icon>
    const icon = new BsIcon(icon_name, "24px");
    // - - </hr-icon>
    start.append(icon);
    // - - <label>
    const label = document.createElement("label");
    label.classList.add("ms-2");
    label.htmlFor = id;
    label.textContent = name;
    // - - </label>
    start.append(label);
    // - </div>
    toggler.append(start);
    // - <hr-icon>
    const dropdown_icon = new BsIcon("caret-down-fill", "16px");
    // - </hr-icon>
    toggler.append(dropdown_icon);
    // </div>
    return toggler;
  };

  static Dropdown = (id: string, inner: HTMLElement) => {
    id = `filter-dropdown-${id}`;

    // <div>
    const dropdown = document.createElement("div");
    dropdown.classList.add(
      "collapse",
      "p-3",
      "border",
      "border-dark",
      "border-2",
      "justify-content-center"
    );
    dropdown.id = id;
    dropdown.append(inner);
    // </div>
    return dropdown;
  };
}
