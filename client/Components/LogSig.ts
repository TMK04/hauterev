import type AsyncInit from "./AsyncInit";

import { createElement, post, urlEncode, whenDefined } from "helpers";

import BsIcon from "./BsIcon";
import GenderInput from "./GenderInput";

export default class LogSig extends HTMLElement implements AsyncInit {
  static id = "logsig";
  static log = "Login";
  static sig = "Sign-up";

  constructor() {
    super();
    this.#init();
  }

  #init = async () => {
    this.classList.add("d-flex");

    // <div>
    const modal = createElement("div", ["modal", "fade"], LogSig.id);
    modal.tabIndex = -1;
    // - <div>
    const modal_dialog = createElement("div", ["modal-dialog", "modal-dialog-centered"]);
    // - - <div>
    const modal_content = createElement("div", ["modal-content"]);
    // - - - <div>
    const modal_header = createElement("div", ["modal-header"]);
    // - - - - <nav>
    const modal_nav = createElement("nav", ["nav", "nav-tabs"]);
    // - - - - </nav>
    modal_header.append(modal_nav);
    // - - - - <button>
    const modal_close = LogSig.ModalClose();
    modal_close.classList.add("btn-close");
    // - - - - </button>
    modal_header.append(modal_close);
    // - - - </div>
    modal_content.append(modal_header);
    // - - - <div>
    const tab_content = createElement("div", ["tab-content"]);
    // - - - - <div>
    await whenDefined("BsIcon");
    const log_tab = LogSig.Tab("log");
    log_tab.classList.add("show", "active");
    const log_row = log_tab.appendChild(LogSig.ModalBody()).appendChild(LogSig.Row());
    log_row.append(
      LogSig.InputColumn("Username", "text", log_tab.id, false, true, "person-fill"),
      LogSig.InputColumn("Password", "password", log_tab.id, false, true, "lock-fill")
    );
    log_tab.append(LogSig.ModalFooter(LogSig.log));
    // - - - - </div>
    tab_content.append(log_tab);
    // - - - - <div>
    const sig_tab = LogSig.Tab("sig");
    const sig_row = sig_tab.appendChild(LogSig.ModalBody()).appendChild(LogSig.Row());
    const sig_username = LogSig.InputColumn("Username", "text", sig_tab.id, true, true, "person");
    const sig_email = LogSig.InputColumn("Email", "email", sig_tab.id, true, true, "envelope");
    const sig_password = LogSig.InputColumn("Password", "password", sig_tab.id, true, true, "lock");
    const sig_confirm_password = LogSig.InputColumn(
      "Confirm Password",
      "password",
      sig_tab.id,
      true,
      true,
      "lock-fill"
    );
    const sig_first_name = LogSig.InputColumn("First Name", "text", sig_tab.id, true);
    const sig_last_name = LogSig.InputColumn("Last Name", "text", sig_tab.id, true, true);
    await whenDefined("GenderInput");
    const sig_gender = LogSig.Column(true);
    const sig_gender_input = new GenderInput(sig_tab.id);
    sig_gender.append(LogSig.Label(sig_gender_input.id, "Gender"), sig_gender_input);
    const sig_mobile_number = LogSig.InputColumn(
      "Mobile Number",
      "tel",
      sig_tab.id,
      true,
      false,
      "telephone"
    );
    const sig_address = LogSig.InputColumn("Address", "text", sig_tab.id, false, false, "at");
    sig_row.append(
      sig_username,
      sig_email,
      sig_password,
      sig_confirm_password,
      sig_first_name,
      sig_last_name,
      sig_gender,
      sig_mobile_number,
      sig_address
    );
    sig_tab.append(LogSig.ModalFooter(LogSig.sig));
    // - - - - </div>
    tab_content.append(sig_tab);

    const log_link = LogSig.NavLink(LogSig.log, log_tab.id);
    log_link.classList.add("active");
    const sig_link = LogSig.NavLink(LogSig.sig, sig_tab.id);
    modal_nav.append(log_link, sig_link);

    // - - - </div>
    modal_content.append(tab_content);
    // - - </div>
    modal_dialog.append(modal_content);
    // - </div>
    modal.append(modal_dialog);
    // </div>
    this.append(modal);

    log_tab.addEventListener("submit", async () => {
      await post("/api/users/auth/login", urlEncode(log_tab));
      setTimeout(location.reload, 2000);
    });

    sig_tab.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      await post("/api/users", urlEncode(sig_tab));
    });
  };

  static NavLink = (name: string, id: string) => {
    const nav_link = createElement("button", ["nav-link"]);
    nav_link.setAttribute("data-bs-toggle", "tab");
    nav_link.setAttribute("data-bs-target", `#${id}`);
    nav_link.type = "button";
    nav_link.textContent = name;
    return nav_link;
  };

  static ModalClose = () => {
    const modal_close = createElement("button");
    modal_close.setAttribute("data-bs-dismiss", "modal");
    modal_close.type = "button";
    return modal_close;
  };

  static Tab = (id: string) => createElement("form", ["tab-pane", "fade"], `${LogSig.id}-${id}`);

  static ModalBody = () => createElement("div", ["modal-body", "container"]);

  static Row = () => createElement("body", ["row", "gy-3"]);

  static Column = (half = false) => createElement("div", half ? ["col-md-6"] : []);

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

  static Input = (name: string, type: string, prefix: string, required = false) => {
    const input = createElement("input", ["form-control"], `${prefix}-${name}`);
    input.name = name;
    input.type = type;
    input.required = required;
    return input;
  };

  static InputColumn = (
    content: string,
    type: string,
    prefix: string,
    half = true,
    required = false,
    bi?: string
  ) => {
    const col = LogSig.Column(half);
    const input = LogSig.Input(content.replace(/\s/g, "-").toLowerCase(), type, prefix, required);
    const label = LogSig.Label(input.id, content, bi);
    col.append(label, input);
    return col;
  };

  static ModalFooter = (submit_text: string) => {
    const modal_footer = createElement("div", ["modal-footer"]);
    const modal_close = LogSig.ModalClose();
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
