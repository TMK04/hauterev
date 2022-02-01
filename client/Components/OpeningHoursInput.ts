import type Input from "./Input";

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

    this.classList.add("d-block", "position-relative", "mx-5");
    // <form>
    this.input = document.createElement("form");
    this.input.id = OpeningHoursInput.id;
    // - <input /> * 2
    const inputLeft = OpeningHoursInput.Input(OpeningHoursInput.min.toString());
    const inputRight = OpeningHoursInput.Input(OpeningHoursInput.max.toString());
    this.input.append(inputLeft, inputRight);
    // - <div>
    const slider = document.createElement("div");
    slider.classList.add("slider", "position-relative");
    slider.style.zIndex = "1";
    slider.style.height = `${OpeningHoursInput.slider_height}px`;
    slider.style.margin = `${(30 - OpeningHoursInput.slider_height) / 2}px ${
      OpeningHoursInput.slider_height
    }px`;
    // - - <div> * 4
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
    const thumbLeft = OpeningHoursInput.Thumb();
    thumbLeft.style.left = "25%";
    thumbLeft.style.transform = `translate(-${transform_x}, ${transform_y})`;
    const thumbRight = OpeningHoursInput.Thumb();
    thumbLeft.style.right = "25%";
    thumbRight.style.transform = `translate(${transform_x}, ${transform_y})`;
    // - - <div> * 4
    slider.append(track, range, thumbLeft, thumbRight);
    // - </div>
    this.input.append(slider);
    // </form>
    this.append(this.input);

    const setLeftValue = () => {
      const value = inputLeft.valueAsNumber;
      const opposite = inputRight.valueAsNumber;
      inputLeft.setAttribute("value", Math.min(value, opposite - 1).toString());

      const percent = (100 * value) / OpeningHoursInput.max + "%";
      thumbLeft.style.left = percent;
      range.style.left = percent;
    };
    setLeftValue();
    const setRightValue = () => {
      const value = inputRight.valueAsNumber;
      const opposite = inputLeft.valueAsNumber;
      inputRight.setAttribute("value", Math.max(value, opposite + 1).toString());

      const percent = 100 - (100 * value) / OpeningHoursInput.max + "%";
      thumbRight.style.right = percent;
      range.style.right = percent;
    };
    setRightValue();

    this.input.addEventListener(
      "input",
      () => oninput && oninput(inputLeft.valueAsNumber, inputRight.valueAsNumber)
    );
    inputLeft.addEventListener("input", setLeftValue);
    inputRight.addEventListener("input", setRightValue);

    inputLeft.addEventListener("mouseover", () => thumbLeft.classList.add("shadow"));
    inputLeft.addEventListener("mouseout", () => thumbLeft.classList.remove("shadow"));
    inputLeft.addEventListener("mousedown", () => thumbLeft.classList.add("shadow-lg"));
    inputLeft.addEventListener("mouseup", () => thumbLeft.classList.remove("shadow-lg"));

    inputRight.addEventListener("mouseover", () => thumbRight.classList.add("shadow"));
    inputRight.addEventListener("mouseout", () => thumbRight.classList.remove("shadow"));
    inputRight.addEventListener("mousedown", () => thumbRight.classList.add("shadow-lg"));
    inputRight.addEventListener("mouseup", () => thumbRight.classList.remove("shadow-lg"));
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
