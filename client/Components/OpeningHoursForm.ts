import type Form from "./Form";

import { center_content_classes, padHour } from "helpers";

export default class OpeningHoursForm extends HTMLElement implements Form {
  static min = 0;
  static max = 23;
  static id = "opening-hours-form";
  readonly form: HTMLFormElement;

  constructor(oninput?: (min: number, max: number) => any) {
    super();

    this.classList.add("d-flex", ...center_content_classes);
    // <div>
    const input_div = document.createElement("div");
    input_div.classList.add("position-relative", "mx-3", "w-75");
    // - <form>
    this.form = document.createElement("form");
    this.form.id = OpeningHoursForm.id;
    // - - <input /> * 2
    const input_left = OpeningHoursForm.Input(OpeningHoursForm.min.toString());
    input_left.id = `${OpeningHoursForm.id}-left`;
    const input_right = OpeningHoursForm.Input(OpeningHoursForm.max.toString());
    input_right.id = `${OpeningHoursForm.id}-right`;
    this.form.append(input_left, input_right);

    const label_left = OpeningHoursForm.Label(input_left.id);
    const label_right = OpeningHoursForm.Label(input_right.id);

    // - - <div>
    const slider = document.createElement("div");
    slider.classList.add(`${OpeningHoursForm.id}-slider`, "position-relative");
    // - - - <div> * 4
    const track = document.createElement("div");
    track.classList.add(
      `${OpeningHoursForm.id}-track`,
      "bg-secondary",
      "position-absolute",
      "rounded-pill"
    );
    const range = document.createElement("div");
    range.classList.add(
      `${OpeningHoursForm.id}-range`,
      "bg-primary",
      "position-absolute",
      "rounded-pill"
    );
    const thumb_left = OpeningHoursForm.Thumb();
    thumb_left.classList.add("left");
    const thumb_right = OpeningHoursForm.Thumb();
    thumb_right.classList.add("right");
    // - - - <div> * 4
    slider.append(track, range, thumb_left, thumb_right);
    // - - </div>
    this.form.append(slider);
    // - </form>
    input_div.append(this.form);
    // </div>
    this.append(label_left, input_div, label_right);

    const setLeftValue = () => {
      const value = input_left.valueAsNumber;
      const opposite = input_right.valueAsNumber;
      const new_value = Math.min(value, opposite - 1);
      input_left.setAttribute("value", new_value.toString());
      label_left.textContent = padHour(new_value);

      const percent = `${(value / OpeningHoursForm.max) * 100}%`;

      thumb_left.style.left = percent;
      range.style.left = percent;
    };
    setLeftValue();
    const setRightValue = () => {
      const value = input_right.valueAsNumber;
      const opposite = input_left.valueAsNumber;
      const new_value = Math.max(value, opposite + 1);
      input_right.setAttribute("value", new_value.toString());
      label_right.textContent = padHour(new_value);

      const percent = `${100 - (value / OpeningHoursForm.max) * 100}%`;

      thumb_right.style.right = percent;
      range.style.right = percent;
    };
    setRightValue();

    this.form.addEventListener(
      "input",
      () => oninput && oninput(input_left.valueAsNumber, input_right.valueAsNumber)
    );
    input_left.addEventListener("input", setLeftValue);
    input_right.addEventListener("input", setRightValue);

    input_left.addEventListener("mouseover", () =>
      thumb_left.classList.replace("shadow-sm", "shadow")
    );
    input_left.addEventListener("mouseout", () =>
      thumb_left.classList.replace("shadow", "shadow-sm")
    );
    input_left.addEventListener("mousedown", () =>
      thumb_left.classList.replace("shadow", "shadow-lg")
    );
    input_left.addEventListener("mouseup", () =>
      thumb_left.classList.replace("shadow-lg", "shadow")
    );

    input_right.addEventListener("mouseover", () =>
      thumb_right.classList.replace("shadow-sm", "shadow")
    );
    input_right.addEventListener("mouseout", () =>
      thumb_right.classList.replace("shadow", "shadow-sm")
    );
    input_right.addEventListener("mousedown", () =>
      thumb_right.classList.replace("shadow", "shadow-lg")
    );
    input_right.addEventListener("mouseup", () =>
      thumb_right.classList.replace("shadow-lg", "shadow")
    );
  }

  static Input = (value: string) => {
    const input = document.createElement("input");
    input.classList.add(`${OpeningHoursForm.id}-input`, "position-absolute", "w-100", "opacity-0");
    input.type = "range";
    input.name = OpeningHoursForm.id;
    input.min = OpeningHoursForm.min.toString();
    input.max = OpeningHoursForm.max.toString();
    input.setAttribute("value", value);
    return input;
  };

  static Label = (id: string) => {
    const label = document.createElement("label");
    label.classList.add("fs-5");
    label.htmlFor = id;
    return label;
  };

  static Thumb = () => {
    const thumb = document.createElement("div");
    thumb.classList.add(
      `${OpeningHoursForm.id}-thumb`,
      "bg-primary",
      "position-absolute",
      "rounded-circle",
      "shadow-sm"
    );
    return thumb;
  };
}
