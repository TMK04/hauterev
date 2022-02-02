export const tag = (Class: string) =>
  `hr${Class.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

export const whenDefined = (Class: string) => customElements.whenDefined(tag(Class));

export const selectCustomElement = (Class: string) => document.querySelector(tag(Class));

export const get = (input: RequestInfo) => fetch(input).then((res) => res.json());

export const btn = () => {
  const btn = document.createElement("button");
  btn.classList.add("btn");
  return btn;
};

export const center_content_classes = ["justify-content-center", "align-items-center"];

export const padHour = (hour: number) => hour.toString().padStart(2, "0").concat(":00");

export const parseHours = (start: number, end: number) => `${padHour(start)}-${padHour(end)}`;

export const parseOpeningHours = (opening_hours: number) => {
  if (!opening_hours) return;
  let start = 0;
  let end = 0;
  const hours = [];
  for (const char of opening_hours.toString(2).padStart(24, "0").concat("0")) {
    const bit = +char;
    if (bit) {
      end += 1;
      continue;
    }
    if (start < end) {
      hours.push(parseHours(start, end));
    }
    start = end = end + 1;
  }
  return hours.join(", ");
};
