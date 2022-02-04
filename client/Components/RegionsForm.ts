import type Form from "./Form";

import { center_content_classes } from "helpers";

export default class RegionsForm extends HTMLElement implements Form {
  static id = "regions-form";
  readonly form: HTMLFormElement;

  constructor(regions: string[] = [], oninput?: (regions: string[]) => any) {
    super();

    // <form>
    this.form = document.createElement("form");
    this.form.id = RegionsForm.id;
    this.form.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );
    for (const region of regions) {
      // <div>
      const check = document.createElement("div");
      check.classList.add("form-check");
      // - <input />
      const id = `${RegionsForm.id}-${region}`;
      const checkbox = document.createElement("input");
      checkbox.classList.add("form-check-input");
      checkbox.setAttribute("value", region);
      checkbox.id = id;
      checkbox.type = "checkbox";
      checkbox.checked = true;
      check.append(checkbox);
      // - <label>
      const label = document.createElement("label");
      label.classList.add("form-check-label");
      label.htmlFor = id;
      label.textContent = region;
      // - </label>
      check.append(label);
      // </div>
      this.form.append(check);
    }
    // </form>
    this.append(this.form);

    this.form.addEventListener(
      "input",
      () =>
        oninput &&
        oninput(
          Array.from(<NodeListOf<HTMLInputElement>>this.form.querySelectorAll("input:checked")).map(
            ({ value }) => value
          )
        )
    );
  }
}
