import type Form from "./Form";

import { center_content_classes, createElement } from "helpers";

export default class RegionsForm extends HTMLElement implements Form {
  static id = "regions-form";
  readonly form: HTMLFormElement;

  constructor(regions: string[] = [], oninput?: (regions: string[]) => any) {
    super();

    // <form>
    this.form = createElement(
      "form",
      ["d-flex", "gap-2", "flex-md-row", "flex-column", ...center_content_classes],
      RegionsForm.id
    );
    for (const region of regions) {
      // <div>
      const check = createElement("div", ["form-check"]);
      // - <input />
      const checkbox = createElement("input", ["form-check-input"], `${RegionsForm.id}-${region}`);
      checkbox.setAttribute("value", region);
      checkbox.type = "checkbox";
      checkbox.checked = true;
      check.append(checkbox);
      // - <label>
      const label = createElement("label", ["form-check-label"]);
      label.htmlFor = checkbox.id;
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
