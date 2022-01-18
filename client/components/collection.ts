import { get } from "helpers";

customElements.define(
  "hr-collection",
  class Collection extends HTMLElement {
    constructor() {
      super();

      const src = this.getAttribute("src");
      if (!src) return;

      const container = document.createElement("div");
      container.classList.add("card-deck", "d-flex", "justify-content-center", "mx-5");

      get(src).then((restaurants) => {
        for (const { id, name, description, image_url } of restaurants) {
          const card = document.createElement("div");
          card.id = id;
          card.classList.add("card", "box-shadow");

          const card_img = document.createElement("img");
          card_img.classList.add("card-img-top");
          card_img.src = image_url;
          card.appendChild(card_img);

          const card_body = document.createElement("body");
          card_body.classList.add("card-body");

          const card_title = document.createElement("h5");
          card_title.classList.add("card-title");
          card_title.textContent = name;
          card_body.appendChild(card_title);

          const card_text = document.createElement("p");
          card_text.classList.add("card-text");
          card_text.textContent = description;
          card_body.appendChild(card_text);

          card.appendChild(card_body);

          container.appendChild(card);
        }
      });

      this.appendChild(container);
    }
  }
);
