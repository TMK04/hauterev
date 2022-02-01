import type Input from "./Input";

import { center_content_classes } from "helpers";

export default class SortInput extends HTMLElement implements Input {
  #id = "sort-input";
  readonly input: HTMLFormElement;

  constructor(sorts: string[] = [], oninput?: (sort: string) => any) {
    super();

    // <form>
    this.input = document.createElement("form");
    this.input.id = this.#id;
    this.input.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );
    this.input.append(this.#Check("Most Relevant"));
    for (const sort of sorts) {
      this.input.append(this.#Check(sort));
    }
    (<HTMLInputElement>this.input.querySelector("input")).checked = true;
    // </form>
    this.append(this.input);

    this.input.addEventListener(
      "input",
      () => oninput && oninput((<RadioNodeList>this.input.elements.namedItem("sort")).value)
    );
  }

  #Check = (sort: string) => {
    // <div>
    const check = document.createElement("div");
    check.classList.add("form-check");
    // - <input />
    const id = `${this.#id}-${sort}`;
    const checkbox = document.createElement("input");
    checkbox.classList.add("form-check-input");
    checkbox.setAttribute("value", sort);
    checkbox.id = id;
    checkbox.type = "radio";
    checkbox.name = "sort";
    check.append(checkbox);
    // - <label>
    const label = document.createElement("label");
    label.classList.add("form-check-label");
    label.htmlFor = id;
    label.textContent = sort;
    // - </label>
    check.append(label);
    // </div>
    return check;
  };
}
