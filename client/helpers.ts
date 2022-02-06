export const createElement = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  classes: string[] = [],
  id?: string
) => {
  const element = document.createElement(tag);
  element.classList.add(...classes);
  if (id) element.id = id;
  return element;
};

export const tag = (Class: string) =>
  `hr${Class.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`;

export const whenDefined = (Class: string) => customElements.whenDefined(tag(Class));

export const selectCustomElement = (Class: string) => document.querySelector(tag(Class));

export const get = (input: RequestInfo, headers: HeadersInit = {}) =>
  fetch(input, { headers }).then((res) => res.json());
export const post = (input: RequestInfo, body: BodyInit, headers: HeadersInit = {}) =>
  fetch(input, { method: "POST", body, headers });
export const del = (input: RequestInfo, body: BodyInit, headers: HeadersInit = {}) =>
  fetch(input, { method: "DELETE", body, headers });

export const goHome = () => location.assign("/index.html");

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

export const utcString = (date_string: string) => new Date(date_string).toUTCString();

export const urlEncode = (form: HTMLFormElement) => {
  const url_encoded = new URLSearchParams();
  for (const [key, value] of new FormData(form)) {
    url_encoded.append(key, value.toString());
  }
  return url_encoded;
};

export const getCookie = (key: string) => {
  const prefix = `${key}=`;
  return document.cookie
    .split(/[; ]/)
    .find((cookie) => cookie.startsWith(prefix))
    ?.substring(prefix.length);
};

export const getUsername = () => getCookie("username");

export const authorizationHeader = () => ({
  Authorization: `Bearer ${getCookie("access_token")}`
});
