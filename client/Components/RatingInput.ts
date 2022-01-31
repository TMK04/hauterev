import { center_content_classes } from "helpers";

export default class RatingInput extends HTMLElement {
  #id = "rating-input";
  #rating: HTMLLabelElement;
  readonly input: HTMLFormElement;

  constructor(oninput?: (value: string) => any) {
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

    for (let i = 9; i > 1; i--) {
      const id = `${this.#id}-${i}`;
      const value = (i / 2 + 0.5).toFixed(1);

      const input = this.#Input(id, value);

      const label = this.#Label(id, value);
      if (i % 2 === 0) label.classList.add("rate-half");

      stars.append(input, label);
    }

    const id_1 = "rating-1";
    const value_1 = "1.0";
    const input_1 = this.#Input(id_1, value_1);
    input_1.checked = true;
    const label_1 = this.#Label(id_1, value_1, "bi-star-fill");
    label_1.classList.add("rate-1");
    stars.append(input_1, label_1);

    this.#rating = document.createElement("label");
    this.#rating.htmlFor = this.#id;
    this.#rating.classList.add("fs-5");
    this.#setRating(value_1);
    this.input.append(this.#rating, stars);

    this.input.addEventListener("input", () => {
      stars
        .querySelectorAll(".rate:not(.rate-1, input:checked ~ .rate)")
        .forEach((e) => e.classList.replace("bi-star-fill", "bi-star"));
      stars
        .querySelectorAll("input:checked ~ .rate")
        .forEach((e) => e.classList.replace("bi-star", "bi-star-fill"));
      const value = (<RadioNodeList>this.input.elements.namedItem(this.#id)).value;
      this.#setRating(value);
      if (oninput) oninput(value);
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

  #Label = (id: string, value: string, star = "bi-star") => {
    const label = document.createElement("label");
    label.classList.add(star, "rate");
    label.htmlFor = id;
    label.title = value;

    return label;
  };
}
