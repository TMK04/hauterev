import type AsyncInit from "./AsyncInit";
import type TopHeader from "./TopHeader";

import {
  authorizationHeader,
  createElement,
  get,
  goHome,
  selectCustomElement,
  utcString,
  whenDefined
} from "helpers";

import BsIcon from "./BsIcon";
import RevCollection from "./RevCollection";

export default class User extends HTMLElement implements AsyncInit {
  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    const username = new URL(document.URL).searchParams.get("username");
    if (username) {
      const top_header = <TopHeader>selectCustomElement("TopHeader");
      top_header.top_header.innerHTML = `${username}'s Profile`;
    } else return goHome();

    const user = await get(`/api/users/${username}`, authorizationHeader());
    if (!user) return goHome();
    const {
      email,
      first_name,
      last_name,
      gender,
      mobile_number,
      address,
      created_timestamp,
      reviews
    } = user;

    this.classList.add("d-block", "container", "mx-auto", "mb-4", "bg-light", "rounded-3");
    const row = createElement("div", [
      "row",
      "px-5",
      "py-4",
      "row-cols-1",
      "row-cols-md-2",
      "row-cols-lg-3",
      "lg"
    ]);
    await whenDefined("BsIcon");
    const details: [string, string, string?][] = [
      [email, "Email", "envelope-fill"],
      [first_name ? `${first_name} ${last_name}` : last_name, "Name"],
      [gender, "Gender"],
      [mobile_number, "Mobile Number", "telephone-fill"],
      [address, "Address", "at"],
      [utcString(created_timestamp), "Joined on", "calendar-event"]
    ];
    for (const [content, title, bi] of details)
      if (content) row.append(User.Detail(content, title, bi));
    this.append(row);

    if (reviews) RevCollection.appendToPage(reviews);
  };

  static Detail = (content: string, title: string, bi?: string) => {
    const detail = createElement("div", ["col", "d-flex", "align-items-start"]);
    if (bi) {
      const icon = new BsIcon(bi, "24px");
      icon.classList.add("me-2");
      detail.append(icon);
    }
    const detail_inner = createElement("div", ["ms-1"]);
    const detail_title = createElement("h4", ["mb-0"]);
    detail_title.textContent = title;
    const detail_content = createElement("p");
    detail_content.textContent = content;
    detail.appendChild(detail_inner).append(detail_title, detail_content);
    return detail;
  };
}
