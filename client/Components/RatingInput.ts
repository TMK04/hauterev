import type { Input } from "./Input";

import { center_content_classes } from "helpers";

export default class RatingInput extends HTMLElement implements Input {
  #id = "rating-input";
  #rating: HTMLLabelElement;
  readonly input: HTMLFormElement;

  constructor(oninput?: (value: number) => any) {
    super();

    this.classList.add("d-flex", ...center_content_classes, "flex-md-row", "flex-column");

    this.input = document.createElement("form");
    this.input.id = this.#id;
    this.input.classList.add(
      "d-flex",
      "gap-2",
      "flex-md-row",
      "flex-column",
      ...center_content_classes
    );

    const stars = document.createElement("div");
    stars.classList.add("d-flex", "flex-row-reverse");

    for (let i = 10; --i; ) {
      const id = `${this.#id}-${i}`;
      const value = (i / 2 + 0.5).toFixed(1);

      const input = this.#Input(id, value);

      const label = this.#Label(id, value);
      if (i % 2 === 0) label.classList.add("rate-half");

      stars.append(input, label);
    }

    const id_0 = "rating-0";
    const value_0 = "0.0";
    const input_0 = this.#Input(id_0, value_0);
    const label_0 = this.#Label(id_0, value_0);
    label_0.classList.add("rate-half", "rate-0");
    stars.append(input_0, label_0);

    this.#rating = document.createElement("label");
    this.#rating.htmlFor = this.#id;
    this.#rating.classList.add("fs-5");
    this.#setRating("0.0");
    this.input.append(this.#rating, stars);

    this.input.addEventListener("input", () => {
      stars
        .querySelectorAll(".rate")
        .forEach((e) => e.classList.replace("bi-star-fill", "bi-star"));
      stars
        .querySelectorAll("input:checked ~ .rate:not(.rate-0)")
        .forEach((e) => e.classList.replace("bi-star", "bi-star-fill"));
      const value = (<RadioNodeList>this.input.elements.namedItem(this.#id)).value;
      this.#setRating(value);
      if (oninput) oninput(+value);
    });

    this.append(this.input);
  }

  #setRating = (value: string) => (this.#rating.textContent = value);

  #Input = (id: string, value: string) => {
    const input = document.createElement("input");
    input.classList.add("d-none");
    input.type = "radio";
    input.name = this.#id;
    input.id = id;
    input.value = value;

    return input;
  };

  #Label = (id: string, value: string) => {
    const label = document.createElement("label");
    label.classList.add("bi-star", "rate");
    label.htmlFor = id;
    label.title = value;

    return label;
  };
}
