import type Input from "./Input";

export default class OpeningHoursInput extends HTMLElement implements Input {
  static min = 0;
  static max = 23;
  static id = "opening-hours-input";
  readonly input: HTMLFormElement;

  constructor(oninput?: (min: number, max: number) => any) {
    super();

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
    slider.classList.add("slider");
    // - - <div> * 4
    const track = document.createElement("div");
    track.classList.add("track", "bg-secondary");
    const range = document.createElement("div");
    range.classList.add("range", "bg-primary");
    const thumbLeft = OpeningHoursInput.Thumb();
    thumbLeft.classList.add("left");
    const thumbRight = OpeningHoursInput.Thumb();
    thumbRight.classList.add("right");
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

    inputLeft.addEventListener("mouseover", () => thumbLeft.classList.add("hover"));
    inputLeft.addEventListener("mouseout", () => thumbLeft.classList.remove("hover"));
    inputLeft.addEventListener("mousedown", () => thumbLeft.classList.add("active"));
    inputLeft.addEventListener("mouseup", () => thumbLeft.classList.remove("active"));

    inputRight.addEventListener("mouseover", () => thumbRight.classList.add("hover"));
    inputRight.addEventListener("mouseout", () => thumbRight.classList.remove("hover"));
    inputRight.addEventListener("mousedown", () => thumbRight.classList.add("active"));
    inputRight.addEventListener("mouseup", () => thumbRight.classList.remove("active"));
  }

  static Input = (value: string) => {
    const input = document.createElement("input");
    input.type = "range";
    input.name = OpeningHoursInput.id;
    input.min = OpeningHoursInput.min.toString();
    input.max = OpeningHoursInput.max.toString();
    input.setAttribute("value", value);
    return input;
  };

  static Thumb = () => {
    const thumb = document.createElement("div");
    thumb.classList.add("thumb", "bg-primary");
    return thumb;
  };
}
