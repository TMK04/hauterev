import type AsyncInit from "./AsyncInit";
import type CollectionHeader from "./CollectionHeader";
import type TopHeader from "./TopHeader";

import {
  createElement,
  get,
  getUsername,
  goHome,
  parseOpeningHours,
  selectCustomElement,
  whenDefined
} from "helpers";

import BsIcon from "./BsIcon";
import PostReview from "./PostReview";
import RevCollection from "./RevCollection";

export default class Restaurant extends HTMLElement implements AsyncInit {
  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    const url = new URL(document.URL);
    const id = url.searchParams.get("id");
    if (!id) return goHome();
    const restaurant = await get(`/api/restaurants/${id}`);
    if (!restaurant) return goHome();
    const { name, description, image_url, avg_rating, opening_hours, region, reviews } = restaurant;

    const top_header = <TopHeader>selectCustomElement("TopHeader");
    top_header.top_header.textContent = name;

    this.innerHTML += `
      <style>
        hr-restaurant {
          background: url(${image_url}) center / cover no-repeat fixed
        }
      </style>
      `;

    this.classList.add("d-flex", "w-100", "mb-4");
    // <div>
    const shadow_container = createElement("div", [
      "container",
      "mx-auto",
      "my-2",
      "border",
      "rounded-1",
      "px-4",
      "py-2",
      "bg-body",
      "lg"
    ]);
    // </div>
    this.append(shadow_container);

    const data = {
      "Average Rating": +avg_rating,
      "Opening Hours": parseOpeningHours(opening_hours),
      "Region": region
    };

    // shadow
    const shadow = shadow_container.attachShadow({ mode: "closed" });
    // <div>
    const shadow_div = createElement("div");
    shadow_div.innerHTML = description;
    // - <section>
    const info = createElement("section");
    // - - <h1>
    const info_header = createElement("h1");
    info_header.textContent = "Info";
    // - - </h1>
    info.append(info_header);
    for (const key in data) {
      const value = (<any>data)[key];
      if (!value) continue;
      // <p>
      const p = createElement("p");
      // - <b>
      const b = createElement("b");
      b.append(`${key}: `);
      // - </b>
      p.append(b, value);
      // </p>
      info.append(p);
    }
    // - </section>
    shadow_div.append(info);
    // </div>
    shadow.append(shadow_div);

    if (reviews) {
      const username = getUsername();
      await RevCollection.appendToPage(reviews);
      if (username) {
        await whenDefined("PostReview");
        const post_review = new PostReview(username, id);
        const post_review_toggler = createElement("a", [
          "d-flex",
          "btn",
          "btn-outline-success",
          "border-0"
        ]);
        post_review_toggler.setAttribute("data-bs-toggle", "modal");
        post_review_toggler.href = `#${PostReview.id}`;
        await whenDefined("BsIcon");
        const icon = new BsIcon("chat-left-quote", "24px");
        icon.classList.add("py-0");
        post_review_toggler.append(icon);
        const reviews_header = <CollectionHeader>selectCustomElement("CollectionHeader");
        reviews_header.classList.add("align-items-center");
        reviews_header.append(post_review_toggler, post_review);
      }
    }
  };
}
