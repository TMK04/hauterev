import type AsyncInit from "../AsyncInit";

import { authorizationHeader, createElement, del } from "helpers";

export default class DeleteReview extends HTMLElement implements AsyncInit {
  static prefix = "post-review";

  constructor(username: string, id: string) {
    super();
    this.#init(username, id);
  }

  #init = async (username: string, id: string) => {
    this.classList.add("d-flex");
    // <div>
    const modal = createElement("form", ["modal", "fade", "sm"], `${DeleteReview.prefix}-${id}`);
    modal.tabIndex = -1;
    // - <div>
    const modal_dialog = createElement("div", [
      "modal-sm",
      "modal-dialog",
      "modal-dialog-centered"
    ]);
    // - - <div>
    const modal_content = createElement("div", ["modal-content"]);
    // - - - <div>
    const modal_header = createElement("div", ["modal-header"]);
    // - - - <h4>
    const modal_heading = createElement("h5", ["modal-title"]);
    modal_heading.textContent = `Delete Review #${id}?`;
    // - - - </h4>
    modal_header.append(modal_heading);
    // - - - <button>
    const modal_close = DeleteReview.ModalClose();
    modal_close.classList.add("btn-close");
    // - - - </button>
    modal_header.append(modal_close);
    // - - - </div>
    modal_content.append(modal_header);
    // - - - <div>
    const modal_footer = DeleteReview.ModalFooter("Confirm");
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
      const res = await del(
        `/api/users/${username}/reviews/${id}`,
        new URLSearchParams(),
        authorizationHeader()
      );
      if (res.ok) location.reload();
    });
  };

  static ModalClose = () => {
    const modal_close = createElement("button");
    modal_close.setAttribute("data-bs-dismiss", "modal");
    modal_close.type = "button";
    return modal_close;
  };

  static ModalFooter = (submit_text: string) => {
    const modal_footer = createElement("div", ["modal-footer"]);
    const modal_close = DeleteReview.ModalClose();
    modal_close.classList.add("btn", "btn-secondary");
    modal_close.textContent = "Cancel";
    modal_footer.append(modal_close);
    const modal_submit = createElement("button", ["btn", "btn-primary"]);
    modal_submit.type = "submit";
    modal_submit.textContent = submit_text;
    modal_footer.append(modal_submit);
    return modal_footer;
  };
}
