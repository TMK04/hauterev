import type Input from "./Input";

import { center_content_classes } from "helpers";

export default class RegionsInput extends HTMLElement implements Input {
  static id = "regions-input";
  readonly input: HTMLFormElement;

  constructor(regions: string[] = [], oninput?: (regions: string[]) => any) {
    super();

    // <form>
    this.input = document.createElement("form");
    this.input.id = RegionsInput.id;
    this.input.classList.add(
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
      const id = `${RegionsInput.id}-${region}`;
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
      this.input.append(check);
    }
    // </form>
    this.append(this.input);

    this.input.addEventListener(
      "input",
      () =>
        oninput &&
        oninput(
          Array.from(
            <NodeListOf<HTMLInputElement>>this.input.querySelectorAll("input:checked")
          ).map(({ value }) => value)
        )
    );
  }
}
