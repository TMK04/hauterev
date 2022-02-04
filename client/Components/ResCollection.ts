import type AsyncInit from "./AsyncInit";

import { get } from "helpers";

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
      const card = document.createElement("div");
      card.id = `${ResCollection.prefix}-${id}`;
      card.classList.add("card", "shadow-sm");
      card.setAttribute("data-avg-rating", avg_rating);
      card.setAttribute("data-opening-hours", opening_hours);
      card.setAttribute("data-region", region);
      // - <a>
      const a = document.createElement("a");
      a.href = `/restaurant.html?id=${id}`;
      // - - <img />
      const card_img = document.createElement("img");
      card_img.classList.add("card-img-top");
      card_img.src = image_url;
      a.append(card_img);
      // - </a>
      card.append(a);
      // - <div>
      const card_body = document.createElement("div");
      card_body.classList.add("card-body");
      // - - <a>
      const card_title = <HTMLAnchorElement>a.cloneNode();
      card_title.classList.add("card-title", "h5");
      card_title.textContent = name;
      // - - </a>
      card_body.append(card_title);
      // - - <p>
      const card_text = document.createElement("p");
      card_text.classList.add("card-text");
      card_text.textContent = description;
      // - - </p>
      card_body.append(card_text);
      // - </div>
      card.append(card_body);
      // </div>
      this.append(card);
    }
  };
}
