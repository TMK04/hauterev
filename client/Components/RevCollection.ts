import type AsyncInit from "./AsyncInit";

import { createElement, get, whenDefined } from "helpers";

import BsIcon from "./BsIcon";

export default class RevCollection extends HTMLElement implements AsyncInit {
  static display = "d-flex";
  static prefix = "rev";

  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    const path = this.getAttribute("path") || "";
    const restaurants = await get(`/api/reviews${path}`);

    this.classList.add(
      "collection",
      "card-deck",
      RevCollection.display,
      "flex-wrap",
      "justify-content-center",
      "mx-5"
    );
    for (const {
      id,
      title,
      description,
      image_url,
      rating,
      username,
      posted_timestamp,
      edited_timestamp
    } of restaurants) {
      // <div>
      const card = createElement("div", ["card", "shadow-sm"], `${RevCollection.prefix}-${id}`);
      // - <div>
      const card_header = createElement("div", ["card-header", "text-center"]);
      const user_link = createElement("a");
      // TODO: make user page
      user_link.href = `/user.html?username=${username}`;
      user_link.textContent = username;
      const rating_span = createElement("b");
      await whenDefined("BsIcon");
      const stars = new BsIcon("stars", "16px");
      stars.classList.add("ms-1");
      rating_span.append(rating, stars);
      card_header.append(user_link, " - ", rating_span);
      // - </div>
      card.append(card_header);
      // - <a>
      const a = createElement("a");
      // TODO: make review modal
      // a.href = review_modal.id;
      // - - <img />
      const card_img = createElement("img", ["card-img-top"]);
      card_img.src = image_url;
      a.append(card_img);
      // - </a>
      card.append(a);
      // - <div>
      const card_body = createElement("div", ["card-body"]);
      // - - <a>
      const card_title = <HTMLAnchorElement>a.cloneNode();
      card_title.classList.add("card-title", "h5", "overflow-hidden");
      card_title.textContent = title;
      // - - </a>
      card_body.append(card_title);
      // - - <p>
      const card_text = createElement("p", ["card-text", "overflow-hidden"]);
      card_text.textContent = description;
      // - - </p>
      card_body.append(card_text);
      // - </div>
      card.append(card_body);
      // - <div>
      const card_footer = createElement("div", ["card-footer"]);
      const small = createElement("small", ["text-muted"]);
      small.append(
        edited_timestamp
          ? `${new Date(edited_timestamp).toUTCString()} (edited)`
          : new Date(posted_timestamp).toUTCString()
      );
      // - </div>
      card.appendChild(card_footer).appendChild(small);
      // </div>
      this.append(card);
    }
  };
}
