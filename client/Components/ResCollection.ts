import { get } from "helpers";

export default class ResCollection extends HTMLElement {
  constructor() {
    super();

    const path = this.getAttribute("path") || "";

    this.classList.add("card-deck", "d-flex", "justify-content-center", "mx-5");

    get(`/api/restaurants${path}`).then((restaurants) => {
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
        card.classList.add("card", "box-shadow");
        card.setAttribute("data-avg-rating", avg_rating);
        card.setAttribute("data-opening-hours", opening_hours);
        card.setAttribute("data-region", region);
        // - <a>
        const a = document.createElement("a");
        a.href = `/api/restaurants/${id}`;
        // - - <img />
        const card_img = document.createElement("img");
        card_img.classList.add("card-img-top");
        card_img.src = image_url;
        // - </a>
        a.append(card_img);
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
        // </div>
        card.append(a, card_body);

        this.append(card);
      }
    });
  }
}
