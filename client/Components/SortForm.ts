import type Form from "./Form";

import { center_content_classes, createElement } from "helpers";

export default class SortForm extends HTMLElement implements Form {
  static id = "sort-form";
  readonly form: HTMLFormElement;

  constructor(sorts: string[] = [], oninput?: (sort: string) => any) {
    super();

    // <form>
    this.form = createElement(
      "form",
      ["d-flex", "gap-2", "flex-md-row", "flex-column", ...center_content_classes],
      SortForm.id
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
    const check = createElement("div", ["form-check"]);
    // - <input />
    const checkbox = createElement("input", ["form-check-input"], `${SortForm.id}-${sort}`);
    checkbox.setAttribute("value", sort);
    checkbox.type = "radio";
    checkbox.name = "sort";
    check.append(checkbox);
    // - <label>
    const label = createElement("label", ["form-check-label"]);
    label.htmlFor = checkbox.id;
    label.textContent = sort;
    // - </label>
    check.append(label);
    // </div>
    return check;
  };
}
