import type Form from "./Form";

import { center_content_classes } from "helpers";

export default class SortForm extends HTMLElement implements Form {
  static id = "sort-form";
  readonly form: HTMLFormElement;

  constructor(sorts: string[] = [], oninput?: (sort: string) => any) {
    super();

    // <form>
    this.form = document.createElement("form");
    this.form.id = SortForm.id;
    this.form.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );
    this.form.append(this.#Check("Most Relevant"));
    for (const sort of sorts) {
      this.form.append(this.#Check(sort));
    }
    (<HTMLInputElement>this.form.querySelector("input")).checked = true;
    // </form>
    this.append(this.form);

    this.form.addEventListener(
      "input",
      () => oninput && oninput((<RadioNodeList>this.form.elements.namedItem("sort")).value)
    );
  }

  #Check = (sort: string) => {
    // <div>
    const check = document.createElement("div");
    check.classList.add("form-check");
    // - <input />
    const id = `${SortForm.id}-${sort}`;
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
