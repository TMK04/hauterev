import type Input from "./Input";

import { center_content_classes } from "helpers";

export default class RatingInput extends HTMLElement implements Input {
  static id = "rating-input";
  #rating: HTMLLabelElement;
  readonly input: HTMLFormElement;

  constructor(oninput?: (value: number) => any) {
    super();

    this.classList.add("d-flex", ...center_content_classes, "flex-md-row", "flex-column");
    // <form>
    this.input = document.createElement("form");
    this.input.id = RatingInput.id;
    this.input.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );
    // - <label>
    this.#rating = document.createElement("label");
    this.#rating.htmlFor = RatingInput.id;
    this.#rating.classList.add("fs-5");
    this.#setRating("0.0");
    // - </label>
    this.input.append(this.#rating);
    // - <div>
    const stars = document.createElement("div");
    stars.classList.add("d-flex", "flex-row-reverse");
    for (let i = 10; --i; ) {
      const id = `${RatingInput.id}-${i}`;
      const value = (i / 2 + 0.5).toFixed(1);

      const input = RatingInput.Input(id, value);
      const label = RatingInput.Label(id, value);
      if (i % 2 === 0) label.classList.add("half");
      stars.append(input, label);
    }
    const id_0 = `${RatingInput.id}-0`;
    const value_0 = "0.0";
    const input_0 = RatingInput.Input(id_0, value_0);
    const label_0 = RatingInput.Label(id_0, value_0);
    label_0.classList.add("half", "zero");
    stars.append(input_0, label_0);
    // - </div>
    this.input.append(stars);

    this.input.addEventListener("input", () => {
      stars
        .querySelectorAll(`.${RatingInput.id}-label`)
        .forEach((e) => e.classList.replace("bi-star-fill", "bi-star"));
      stars
        .querySelectorAll(`.${RatingInput.id}-input:checked ~ .${RatingInput.id}-label:not(.zero)`)
        .forEach((e) => e.classList.replace("bi-star", "bi-star-fill"));
      const value = (<RadioNodeList>this.input.elements.namedItem(RatingInput.id)).value;
      this.#setRating(value);
      if (oninput) oninput(+value);
    });

    // </form>
    this.append(this.input);
  }

  #setRating = (value: string) => (this.#rating.textContent = value);

  static Input = (id: string, value: string) => {
    const input = document.createElement("input");
    input.classList.add(`${RatingInput.id}-input`, "d-none");
    input.type = "radio";
    input.name = RatingInput.id;
    input.id = id;
    input.value = value;

    return input;
  };

  static Label = (id: string, value: string) => {
    const label = document.createElement("label");
    label.classList.add(`${RatingInput.id}-label`, "bi-star");
    label.htmlFor = id;
    label.title = value;

    return label;
  };
}
