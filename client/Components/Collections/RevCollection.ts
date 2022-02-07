import type AsyncInit from "../AsyncInit";

import BsIcon from "../BsIcon";
import CollectionHeader from "../Headers/CollectionHeader";
import UserCollectionToggle from "../UserCollectionToggle";
import {
  authorizationHeader,
  createElement,
  get,
  getUsername,
  utcString,
  whenDefined
} from "helpers";

export default class RevCollection extends HTMLElement implements AsyncInit {
  static display = "d-flex";
  static prefix = "rev";

  constructor(reviews?: any) {
    super();
    this.#init(reviews);
  }

  #init = async (_reviews?: any) => {
    const path = this.getAttribute("path") || "";
    const reviews = _reviews || (await get(`/api/reviews${path}`));
    const current_username = getUsername();
    const helpful_marks = current_username
      ? <any[]>await get(`/api/users/${current_username}/helpful-marks`, authorizationHeader())
      : undefined;

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
    } of reviews) {
      // <div>
      const card = createElement(
        "div",
        ["card", "shadow-sm", "md"],
        `${RevCollection.prefix}-${id}`
      );
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
      const card_body = createElement("div", ["card-body", "d-flex", "flex-column"]);
      // - - <a>
      const card_title = <HTMLAnchorElement>a.cloneNode();
      card_title.classList.add("card-title", "h5", "overflow-hidden", "text-center");
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
        edited_timestamp ? `${utcString(edited_timestamp)} (edited)` : utcString(posted_timestamp)
      );
      // - </div>
      card.appendChild(card_footer).appendChild(small);
      // </div>
      this.append(card);

      if (current_username) {
        // <div>
        const buttons = createElement("div", ["card-text", "mt-auto", "ms-auto"]);
        await whenDefined("UserCollectionToggle");
        buttons.append(
          new UserCollectionToggle(
            "hand-thumbs-up",
            username,
            "helpful-marks",
            new URLSearchParams({ review_id: id }),
            "review_id",
            <0 | 1>+!helpful_marks?.map(({ review_id }) => review_id).includes(id)
          )
        );
        // </div>
        card_body.append(buttons);
      }
    }
  };

  static appendToPage = async (reviews: any, extra = "") => {
    await whenDefined("CollectionHeader");
    await whenDefined("RevCollection");
    (<HTMLDivElement>document.getElementById("page")).append(
      new CollectionHeader(`Reviews${extra}`),
      new RevCollection(reviews)
    );
  };
}
