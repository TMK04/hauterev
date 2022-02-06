import type AsyncInit from "./AsyncInit";

import { authorizationHeader, del, post, whenDefined } from "helpers";

import BsIcon from "./BsIcon";

type Method = (input: RequestInfo, body: BodyInit, headers?: HeadersInit) => Promise<Response>;

export default class UserCollectionToggle extends HTMLElement implements AsyncInit {
  #username: string;
  #route: string;
  #body: URLSearchParams;
  #prefix: string;

  constructor(
    bi: string,
    username: string,
    route: string,
    body: URLSearchParams,
    key: string,
    initially_active: 0 | 1
  ) {
    super();
    this.#username = username;
    this.#route = route;
    this.#body = body;
    this.#prefix = `${route}-${body.get(key)}`;
    this.#init(bi, initially_active);
  }

  #init = async (bi: string, initially_inactive: 0 | 1) => {
    await whenDefined("BsIcon");
    // <button> * 2
    const buttons = <const>[this.#Btn(bi, "add"), this.#Btn(`${bi}-fill`, "remove")];
    buttons[initially_inactive]?.classList.replace(BsIcon.display, "d-none");
    this.#addOnClick(buttons[0], buttons[1], post);
    this.#addOnClick(buttons[1], buttons[0], del);
    // </button> * 2
    this.append(...buttons);
  };

  #addOnClick = (current: BsIcon, other: BsIcon, method: Method) => {
    current.addEventListener("click", async () => {
      const res = await method(
        `/api/users/${this.#username}/${this.#route}`,
        this.#body,
        authorizationHeader()
      );
      if (res.ok) {
        UserCollectionToggle.toggle(current, other);
      }
    });
  };

  #Btn = (bi: string, aOr: "add" | "remove") => {
    const btn = new BsIcon(bi, "16px");
    btn.classList.add("btn", "btn-light", "btn-outline-dark");
    btn.setAttribute("uct", `${this.#prefix}-${aOr}`);
    return btn;
  };

  static toggle = (active: BsIcon, inactive: BsIcon) => {
    document
      .querySelectorAll(`[uct=${active.getAttribute("uct")}]`)
      .forEach((e) => e.classList.replace(BsIcon.display, "d-none"));
    document
      .querySelectorAll(`[uct=${inactive.getAttribute("uct")}]`)
      .forEach((e) => e.classList.replace("d-none", BsIcon.display));
  };
}
