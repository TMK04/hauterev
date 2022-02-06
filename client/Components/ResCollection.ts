import type AsyncInit from "./AsyncInit";

import { authorizationHeader, createElement, get, getUsername, whenDefined } from "helpers";

import BsIcon from "./BsIcon";
import UserCollectionToggle from "./UserCollectionToggle";

export default class ResCollection extends HTMLElement implements AsyncInit {
  static display = "d-flex";
  static prefix = "res";

  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    const path = this.getAttribute("path") || "";
    const restaurants = await get(`/api/restaurants${path}`);
    const username = getUsername();
    const bookmarks = username
      ? <any[]>await get(`/api/users/${username}/bookmarks`, authorizationHeader())
      : undefined;

    this.classList.add(
      "collection",
      "card-deck",
      ResCollection.display,
      "flex-wrap",
      "justify-content-center",
      "mx-5"
    );
    for (const {
      id,
      name,
      description,
      image_url,
      avg_rating,
      opening_hours,
      region
    } of restaurants) {
      // <div>
      const card = createElement("div", ["card", "shadow-sm"], `${ResCollection.prefix}-${id}`);
      card.setAttribute("data-avg-rating", avg_rating);
      card.setAttribute("data-opening-hours", opening_hours);
      card.setAttribute("data-region", region);
      // - <a>
      const a = createElement("a");
      a.href = `/restaurant.html?id=${id}`;
      // - - <img />
      const card_img = createElement("img", ["card-img-top"]);
      card_img.src = image_url;
      a.append(card_img);
      // - </a>
      card.append(a);
      // - <div>
      const card_body = createElement("div", ["card-body", "d-flex", "flex-column"]);
      // - - <a>
      const card_title = <HTMLAnchorElement>a.cloneNode();
      card_title.classList.add("card-title", "h5", "overflow-hidden", "text-center");
      card_title.textContent = name;
      // - - </a>
      card_body.append(card_title);
      // - - <p>
      const card_text = createElement("p", ["card-text", "overflow-hidden"]);
      card_text.textContent = description;
      // - - </p>
      card_body.append(card_text);
      if (username) {
        // <div>
        const buttons = createElement("div", ["card-text", "mt-auto", "ms-auto"]);
        await whenDefined("UserCollectionToggle");
        buttons.append(
          new UserCollectionToggle(
            "bookmark",
            username,
            "bookmarks",
            new URLSearchParams({ restaurant_id: id }),
            "restaurant_id",
            <0 | 1>+!bookmarks?.map(({ restaurant_id }) => restaurant_id).includes(id)
          )
        );
        // </div>
        card_body.append(buttons);
      }
      // - </div>
      card.append(card_body);
      // </div>
      this.append(card);
    }
  };

  static Bookmark = (bi: string) => {
    const bookmark = new BsIcon(bi, "24px");
    bookmark.classList.add("btn", "btn-light");
    return bookmark;
  };
}
