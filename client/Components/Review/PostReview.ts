import type AsyncInit from "../AsyncInit";

import BsIcon from "../BsIcon";
import RatingForm from "../Forms/RatingForm";
import { authorizationHeader, createElement, post, urlEncode, whenDefined } from "helpers";

export default class PostReview extends HTMLElement implements AsyncInit {
  static id = "post-review";

  constructor(username: string, restaurant_id: string) {
    super();
    this.#init(username, restaurant_id);
  }

  #init = async (username: string, restaurant_id: string) => {
    this.classList.add("d-flex");
    // <div>
    const modal = createElement("form", ["modal", "fade", "md"], PostReview.id);
    modal.tabIndex = -1;
    // - <div>
    const modal_dialog = createElement("div", ["modal-dialog", "modal-dialog-centered"]);
    // - - <div>
    const modal_content = createElement("div", ["modal-content"]);
    // - - - <div>
    const modal_header = createElement("div", ["modal-header"]);
    // - - - <h4>
    const modal_heading = createElement("h5", ["modal-title"]);
    modal_heading.textContent = "Post new Review";
    // - - - </h4>
    modal_header.append(modal_heading);
    // - - - <button>
    const modal_close = PostReview.ModalClose();
    modal_close.classList.add("btn-close");
    // - - - </button>
    modal_header.append(modal_close);
    // - - - </div>
    modal_content.append(modal_header);
    // - - - <div>
    const modal_body = PostReview.ModalBody();
    // - - - - <div>
    const modal_row = PostReview.Row();
    const modal_restaurant_id = PostReview.Input("restaurant_id", "number");
    modal_restaurant_id.setAttribute("value", restaurant_id);
    modal_restaurant_id.classList.add("d-none");
    const modal_rating = PostReview.Column();
    const modal_rating_input = PostReview.Input("rating", "number");
    modal_rating_input.classList.add("d-none");
    await whenDefined("RatingForm");
    const modal_rating_form = new RatingForm((value) =>
      modal_rating_input.setAttribute("value", value.toString())
    );
    const modal_rating_label = PostReview.Label(modal_rating_form.form.id, "Rating", "star-half");
    modal_rating_label.classList.add("d-block", "text-center", "fs-6", "text-decoration-underline");
    modal_rating.append(modal_rating_input, modal_rating_label, modal_rating_form);
    modal_row.append(
      modal_restaurant_id,
      PostReview.InputColumn("Title", "text"),
      PostReview.InputColumn("Description", "text"),
      PostReview.InputColumn("Image URL", "text"),
      modal_rating
    );
    // - - - - </div>
    modal_body.append(modal_row);
    // - - - </div>
    modal_content.append(modal_body);
    // - - - <div>
    const modal_footer = PostReview.ModalFooter("Post");
    // - - - </div>
    modal_content.append(modal_footer);
    // - - </div>
    modal_dialog.append(modal_content);
    // - </div>
    modal.append(modal_dialog);
    // </div>
    this.append(modal);

    modal.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      await post(`/api/users/${username}/reviews`, urlEncode(modal), authorizationHeader());
    });
  };

  static ModalClose = () => {
    const modal_close = createElement("button");
    modal_close.setAttribute("data-bs-dismiss", "modal");
    modal_close.type = "button";
    return modal_close;
  };

  static ModalBody = () => createElement("div", ["modal-body", "container"]);

  static Row = () => createElement("body", ["row", "gy-3"]);

  static Column = () => createElement("div");

  static Label = (id: string, content: string, bi?: string) => {
    const label = createElement("label");
    label.htmlFor = id;
    if (bi) {
      const icon = new BsIcon(bi, "16px");
      icon.classList.add("me-1");
      label.append(icon);
    }
    label.append(content);
    return label;
  };

  static Input = (name: string, type: string, required = true) => {
    const input = createElement("input", ["form-control"], `${PostReview.id}-${name}`);
    input.name = name;
    input.type = type;
    input.required = required;
    return input;
  };

  static InputColumn = (content: string, type: string, required = true, bi?: string) => {
    const col = PostReview.Column();
    const input = PostReview.Input(content.replace(/\s/g, "_").toLowerCase(), type, required);
    const label = PostReview.Label(input.id, content, bi);
    col.append(label, input);
    return col;
  };

  static ModalFooter = (submit_text: string) => {
    const modal_footer = createElement("div", ["modal-footer"]);
    const modal_close = PostReview.ModalClose();
    modal_close.classList.add("btn", "btn-secondary");
    modal_close.textContent = "Close";
    modal_footer.append(modal_close);
    const modal_submit = createElement("button", ["btn", "btn-primary"]);
    modal_submit.type = "submit";
    modal_submit.textContent = submit_text;
    modal_footer.append(modal_submit);
    return modal_footer;
  };
}
