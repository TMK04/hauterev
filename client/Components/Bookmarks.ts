import type AsyncInit from "./AsyncInit";

import { authorizationHeader, createElement, get, whenDefined } from "helpers";

import UserCollectionToggle from "./UserCollectionToggle";

export default class Bookmarks extends HTMLElement implements AsyncInit {
  constructor(username: string) {
    super();
    this.#init(username);
  }

  #init = async (username: string) => {
    this.id = "bookmarks";
    this.classList.add(
      "d-flex",
      "w-50",
      "mx-auto",
      "flex-column",
      "align-items-stretch",
      "bg-light",
      "rounded-3",
      "pb-3",
      "mb-5",
      "border",
      "box-shadow",
      "shadow-lg",
      "lg"
    );
    // <a>
    const title = createElement("h4", [
      "p-3",
      "border-bottom",
      "text-center",
      "fw-semibold",
      "mb-0"
    ]);
    title.textContent = "Bookmarks";
    // </a>
    this.append(title);
    // <div>
    const list = createElement("div", [
      "list-group",
      "list-group-flush",
      "container-fluid",
      "px-3",
      "scrollarea"
    ]);
    for (const { restaurant_id, image_url, name } of await get(
      `/api/users/${username}/bookmarks`,
      authorizationHeader()
    )) {
      // <div>
      const item = createElement("div", [
        "list-group-item",
        "row",
        "py-3",
        "d-flex",
        "align-items-center",
        "flex-md-row",
        "flex-column",
        "gx-3",
        "gy-2",
        "m-0"
      ]);
      item.setAttribute("restaurant_id", restaurant_id);
      // - <div>
      const content = createElement("div", [
        "align-items-center",
        "flex-lg-row",
        "flex-column",
        "d-flex",
        "col-9",
        "px-0",
        "gap-3",
        "mt-0"
      ]);
      // - - <a>
      const link = createElement("a", ["px-0"]);
      link.href = `/restaurant.html?id=${restaurant_id}`;
      // - - - <img />
      const img = createElement("img", [
        "d-flex",
        "ms-lg-auto",
        "me-lg-0",
        "mx-auto",
        "rounded-circle"
      ]);
      img.src = image_url;
      img.width = 64;
      img.height = 64;
      link.append(img);
      // - - </a>
      content.append(link);
      // - - <a>
      const title = <HTMLAnchorElement>link.cloneNode();
      title.classList.add("h6", "col-lg-8", "mb-0", "d-flex", "text-lg-start", "text-center");
      title.textContent = name;

      link.classList.add("d-block", "col-lg-4");

      // - - </a>
      content.append(title);
      // - </div>
      item.append(content);
      await whenDefined("UserCollectionToggle");
      const bookmark = new UserCollectionToggle(
        "bookmark",
        username,
        "bookmarks",
        new URLSearchParams({ restaurant_id }),
        "restaurant_id",
        0
      );
      bookmark.classList.add("col-3", "justify-content-center", "d-flex", "px-0");
      item.append(bookmark);
      // </span>
      list.append(item);
    }
    // </div>
    this.append(list);
  };
}
