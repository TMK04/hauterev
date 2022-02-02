import type AsyncInit from "./AsyncInit";
import type TopHeader from "./TopHeader";

import { get, parseOpeningHours, tag, whenDefined } from "helpers";

export default class Restaurant extends HTMLElement implements AsyncInit {
  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    const url = new URL(document.URL);
    const id = url.searchParams.get("id");
    if (!id) return;
    const restaurant = await get(`/api/restaurants/${id}`);
    if (!restaurant) return;
    const { name, description, image_url, avg_rating, opening_hours, region } = restaurant;

    this.innerHTML += `
      <style>
        hr-restaurant {
          background: url(${image_url}) center / cover no-repeat fixed
        }
      </style>
      `;

    this.classList.add("d-flex", "w-100", "mb-4");
    // <div>
    const shadow_container = document.createElement("div");
    shadow_container.classList.add(
      "container",
      "mx-auto",
      "my-2",
      "border",
      "rounded-1",
      "px-4",
      "py-2",
      "bg-body"
    );
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
    const shadow_div = document.createElement("div");
    shadow_div.innerHTML = description;
    // - <section>
    const info = document.createElement("section");
    // - - <h1>
    const info_header = document.createElement("h1");
    info_header.textContent = "Info";
    // - - </h1>
    info.append(info_header);
    for (const key in data) {
      const value = (<any>data)[key];
      if (!value) continue;
      // <p>
      const p = document.createElement("p");
      // - <b>
      const b = document.createElement("b");
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

    await whenDefined("TopHeader");
    const top_header = <TopHeader>document.querySelector(tag("TopHeader"));
    top_header.top_header.textContent = name;
  };
}
