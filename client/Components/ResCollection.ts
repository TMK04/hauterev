import type AsyncInit from "./AsyncInit";

import { get } from "helpers";

export default class ResCollection extends HTMLElement implements AsyncInit {
  constructor() {
    super();

    this.#init();
  }

  #init = async () => {
    const path = this.getAttribute("path") || "";
    const restaurants = await get(`/api/restaurants${path}`);

    this.classList.add("card-deck", "d-flex", "flex-wrap", "justify-content-center", "mx-5");
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
      card.id = id;
      card.classList.add("card", "shadow-sm");
      card.setAttribute("data-avg-rating", avg_rating);
      card.setAttribute("data-opening-hours", opening_hours);
      card.setAttribute("data-region", region);
      // - <a>
      const a = document.createElement("a");
      a.href = `/api/restaurant.html?id=${id}`;
      // - - <img />
      const card_img = document.createElement("img");
      card_img.classList.add("card-img-top");
      card_img.src = image_url;
      card_img.style.height = "200px";
      card_img.style.objectFit = "cover";
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
      card.style.width = "300px";
      // </div>
      this.append(card);
    }

    this.style.gap = "60px 80px";
    this.style.marginBottom = "64px";
  };
}
