import Icon from "./Icon";

const Row = () => {
  const row = document.createElement("div");
  row.classList.add("row", "w-100", "mx-0");
  return row;
};

const Toggler = (id: string, src: string, name: string) => {
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
    "p-3"
  );
  toggler.id = id;
  // - <div>
  const start = document.createElement("div");
  start.classList.add("d-flex", "w-100", "justify-content-md-start", "justify-content-center");
  // - - <hr-icon>
  const icon = new Icon(src, 24);
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
  const dropdown_icon = new Icon("dropdown.svg", 16);
  icon.classList.add("mt-1");
  // - </hr-icon>
  toggler.append(dropdown_icon);
  // </div>
  return toggler;
};

const Dropdown = (id: string) => {
  id = `filter-filter-${id}`;

  // <div>
  const dropdown = document.createElement("form");
  dropdown.classList.add(
    "collapse",
    "p-3",
    "border",
    "border-dark",
    "border-2",
    "justify-content-center"
  );
  dropdown.id = id;
  dropdown.textContent = id;
  // </div>
  return dropdown;
};

type TogglerType = ReturnType<typeof Toggler>;
type DropdownType = ReturnType<typeof Dropdown>;
interface ActiveGroup {
  toggler: TogglerType;
  dropdown: DropdownType;
}

export default class ResFilters extends HTMLElement {
  #active: ActiveGroup | undefined;

  constructor() {
    super();

    const options: [string, string, string][] = [
      ["min-rating", "rating.svg", "Min. Rating"],
      ["opening-hours", "opening-hours.svg", "Opening Hours"],
      ["region", "region.svg", "Region"],
      ["sort-by", "sort.svg", "Sort by"]
    ];

    // <div>
    const container = document.createElement("div");
    container.classList.add("container", "justify-content-center", "mx-auto", "mb-4");
    // - <div> * 2
    const togglers_row = Row();
    const dropdowns_row = Row();
    for (const [id, src, name] of options) {
      const toggler = Toggler(id, src, name);
      const dropdown = Dropdown(id);
      toggler.addEventListener("click", () =>
        this.active?.toggler === toggler
          ? (this.active = undefined)
          : (this.active = { toggler, dropdown })
      );
      togglers_row.append(toggler);
      dropdowns_row.append(dropdown);
    }
    // - </div> * 2
    container.append(togglers_row, dropdowns_row);
    // </div>
    this.append(container);
  }

  #deactivate = () => {
    if (this.#active) {
      const { toggler, dropdown } = this.#active;
      toggler.classList.remove("border-primary");
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
      toggler.classList.add("border-primary");
      dropdown.classList.add("show");
    }
    this.#active = active;
  }
}
