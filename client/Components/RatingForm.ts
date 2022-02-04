import type Form from "./Form";

import { center_content_classes } from "helpers";

export default class RatingForm extends HTMLElement implements Form {
  static id = "rating-form";
  #rating: HTMLLabelElement;
  readonly form: HTMLFormElement;

  constructor(oninput?: (value: number) => any) {
    super();

    this.classList.add("d-flex", ...center_content_classes, "flex-md-row", "flex-column");
    // <form>
    this.form = document.createElement("form");
    this.form.id = RatingForm.id;
    this.form.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );
    // - <label>
    this.#rating = document.createElement("label");
    this.#rating.htmlFor = RatingForm.id;
    this.#rating.classList.add("fs-5");
    this.#setRating("0.0");
    // - </label>
    this.form.append(this.#rating);
    // - <div>
    const stars = document.createElement("div");
    stars.classList.add("d-flex", "flex-row-reverse");
    for (let i = 10; --i; ) {
      const id = `${RatingForm.id}-${i}`;
      const value = (i / 2 + 0.5).toFixed(1);

      const input = RatingForm.Input(id, value);
      const label = RatingForm.Label(id, value);
      if (i % 2 === 0) label.classList.add("half");
      stars.append(input, label);
    }
    const id_0 = `${RatingForm.id}-0`;
    const value_0 = "0.0";
    const input_0 = RatingForm.Input(id_0, value_0);
    const label_0 = RatingForm.Label(id_0, value_0);
    label_0.classList.add("half", "zero");
    stars.append(input_0, label_0);
    // - </div>
    this.form.append(stars);

    this.form.addEventListener("input", () => {
      stars
        .querySelectorAll(`.${RatingForm.id}-label`)
        .forEach((e) => e.classList.replace("bi-star-fill", "bi-star"));
      stars
        .querySelectorAll(`.${RatingForm.id}-input:checked ~ .${RatingForm.id}-label:not(.zero)`)
        .forEach((e) => e.classList.replace("bi-star", "bi-star-fill"));
      const value = (<RadioNodeList>this.form.elements.namedItem(RatingForm.id)).value;
      this.#setRating(value);
      if (oninput) oninput(+value);
    });

    // </form>
    this.append(this.form);
  }

  #setRating = (value: string) => (this.#rating.textContent = value);

  static Input = (id: string, value: string) => {
    const input = document.createElement("input");
    input.classList.add(`${RatingForm.id}-input`, "d-none");
    input.type = "radio";
    input.name = RatingForm.id;
    input.id = id;
    input.value = value;

    return input;
  };

  static Label = (id: string, value: string) => {
    const label = document.createElement("label");
    label.classList.add(`${RatingForm.id}-label`, "bi-star");
    label.htmlFor = id;
    label.title = value;

    return label;
  };
}
