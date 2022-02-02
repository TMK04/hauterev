import type Input from "./Input";

import { center_content_classes, padHour } from "helpers";

export default class OpeningHoursInput extends HTMLElement implements Input {
  static slider_height = 8;
  static thumb_size = 20;
  static min = 0;
  static max = 23;
  static id = "opening-hours-input";
  readonly input: HTMLFormElement;

  constructor(oninput?: (min: number, max: number) => any) {
    super();

    this.innerHTML += `
      <style>
        input[type="range"]::-webkit-slider-thumb {
          pointer-events: all;
          width: ${OpeningHoursInput.thumb_size}px;
          height: ${OpeningHoursInput.thumb_size}px;
          border-radius: 0;
          border: 0 none;
          background-color: red;
          appearance: none;
        }
      </style>
      `;

    this.classList.add("d-flex", ...center_content_classes);
    // <div>
    const input_div = document.createElement("div");
    input_div.classList.add("position-relative", "mx-3", "w-75");
    // - <form>
    this.input = document.createElement("form");
    this.input.id = OpeningHoursInput.id;
    // - - <input /> * 2
    const input_left = OpeningHoursInput.Input(OpeningHoursInput.min.toString());
    input_left.id = `${OpeningHoursInput.id}-left`;
    const input_right = OpeningHoursInput.Input(OpeningHoursInput.max.toString());
    input_right.id = `${OpeningHoursInput.id}-right`;
    this.input.append(input_left, input_right);

    const label_left = OpeningHoursInput.Label(input_left.id);
    const label_right = OpeningHoursInput.Label(input_right.id);

    // - - <div>
    const slider = document.createElement("div");
    slider.classList.add("slider", "position-relative");
    slider.style.zIndex = "1";
    slider.style.height = `${OpeningHoursInput.slider_height}px`;
    slider.style.margin = `${(30 - OpeningHoursInput.slider_height) / 2}px ${
      OpeningHoursInput.slider_height
    }px`;
    // - - - <div> * 4
    const track = document.createElement("div");
    track.classList.add("track", "bg-secondary", "position-absolute", "rounded-pill");
    track.style.zIndex = "1";
    track.style.left = "0";
    track.style.right = "0";
    track.style.top = "0";
    track.style.bottom = "0";
    const range = document.createElement("div");
    range.classList.add("range", "bg-primary", "position-absolute", "rounded-pill");
    range.style.zIndex = "2";
    range.style.left = "25%";
    range.style.right = "25%";
    range.style.top = "0";
    range.style.bottom = "0";
    const transform_x = `${OpeningHoursInput.thumb_size / 2}px`;
    const transform_y = `-${
      (OpeningHoursInput.thumb_size - OpeningHoursInput.slider_height) / 2
    }px`;
    const thumb_left = OpeningHoursInput.Thumb();
    thumb_left.style.left = "25%";
    thumb_left.style.transform = `translate(-${transform_x}, ${transform_y})`;
    const thumb_right = OpeningHoursInput.Thumb();
    thumb_left.style.right = "25%";
    thumb_right.style.transform = `translate(${transform_x}, ${transform_y})`;
    // - - - <div> * 4
    slider.append(track, range, thumb_left, thumb_right);
    // - - </div>
    this.input.append(slider);
    // - </form>
    input_div.append(this.input);
    // </div>
    this.append(label_left, input_div, label_right);

    const setLeftValue = () => {
      const value = input_left.valueAsNumber;
      const opposite = input_right.valueAsNumber;
      const new_value = Math.min(value, opposite - 1);
      input_left.setAttribute("value", new_value.toString());
      label_left.textContent = padHour(new_value);

      const percent = (100 * value) / OpeningHoursInput.max + "%";
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

      const percent = 100 - (100 * value) / OpeningHoursInput.max + "%";
      thumb_right.style.right = percent;
      range.style.right = percent;
    };
    setRightValue();

    this.input.addEventListener(
      "input",
      () => oninput && oninput(input_left.valueAsNumber, input_right.valueAsNumber)
    );
    input_left.addEventListener("input", setLeftValue);
    input_right.addEventListener("input", setRightValue);

    input_left.addEventListener("mouseover", () => thumb_left.classList.add("shadow"));
    input_left.addEventListener("mouseout", () => thumb_left.classList.remove("shadow"));
    input_left.addEventListener("mousedown", () => thumb_left.classList.add("shadow-lg"));
    input_left.addEventListener("mouseup", () => thumb_left.classList.remove("shadow-lg"));

    input_right.addEventListener("mouseover", () => thumb_right.classList.add("shadow"));
    input_right.addEventListener("mouseout", () => thumb_right.classList.remove("shadow"));
    input_right.addEventListener("mousedown", () => thumb_right.classList.add("shadow-lg"));
    input_right.addEventListener("mouseup", () => thumb_right.classList.remove("shadow-lg"));
  }

  static Input = (value: string) => {
    const input = document.createElement("input");
    input.classList.add("position-absolute", "w-100", "opacity-0");
    input.type = "range";
    input.name = OpeningHoursInput.id;
    input.min = OpeningHoursInput.min.toString();
    input.max = OpeningHoursInput.max.toString();
    input.setAttribute("value", value);
    input.style.zIndex = "2";
    input.style.height = "10px";
    input.style.pointerEvents = "none";
    input.style.appearance = "none";
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
    thumb.classList.add("thumb", "bg-primary", "position-absolute", "rounded-circle", "shadow-sm");
    thumb.style.zIndex = "3";
    thumb.style.width = "20px";
    thumb.style.height = "20px";
    thumb.style.transition = "box-shadow 0.3s ease-in-out";
    return thumb;
  };
}
