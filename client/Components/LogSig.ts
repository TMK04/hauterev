import { post, urlEncode, whenDefined } from "helpers";

import BsIcon from "./BsIcon";
import GenderInput from "./GenderInput";

export default class LogSig extends HTMLElement {
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
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.tabIndex = -1;
    modal.id = LogSig.id;
    // - <div>
    const modal_dialog = document.createElement("div");
    modal_dialog.classList.add("modal-dialog", "modal-dialog-centered");
    // - - <div>
    const modal_content = document.createElement("div");
    modal_content.classList.add("modal-content");
    // - - - <div>
    const modal_header = document.createElement("div");
    modal_header.classList.add("modal-header");
    // - - - - <nav>
    const modal_nav = document.createElement("nav");
    modal_nav.classList.add("nav", "nav-tabs");
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
    const tab_content = document.createElement("div");
    tab_content.classList.add("tab-content");
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

    log_tab.addEventListener("submit", () => post("/api/users/login", urlEncode(log_tab)));

    sig_tab.addEventListener("submit", async (ev) => {
      await post("/api/users", urlEncode(sig_tab));

      ev.preventDefault();
    });
  };

  static NavLink = (name: string, id: string) => {
    const nav_link = document.createElement("button");
    nav_link.classList.add("nav-link");
    nav_link.setAttribute("data-bs-toggle", "tab");
    nav_link.setAttribute("data-bs-target", `#${id}`);
    nav_link.type = "button";
    nav_link.textContent = name;
    return nav_link;
  };

  static ModalClose = () => {
    const modal_close = document.createElement("button");
    modal_close.setAttribute("data-bs-dismiss", "modal");
    modal_close.type = "button";
    return modal_close;
  };

  static Tab = (id: string) => {
    const tab = document.createElement("form");
    tab.classList.add("tab-pane", "fade");
    tab.id = `${LogSig.id}-${id}`;
    return tab;
  };

  static ModalBody = () => {
    const modal_body = document.createElement("div");
    modal_body.classList.add("modal-body", "container");
    return modal_body;
  };

  static Row = () => {
    const row = document.createElement("body");
    row.classList.add("row", "gy-3");
    return row;
  };

  static Column = (half = false) => {
    const col = document.createElement("div");
    if (half) col.classList.add("col-md-6");
    return col;
  };

  static Label = (id: string, content: string, bi?: string) => {
    const label = document.createElement("label");
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
    const input = document.createElement("input");
    input.classList.add("form-control");
    input.name = name;
    input.id = `${prefix}-${name}`;
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
    const modal_footer = document.createElement("div");
    modal_footer.classList.add("modal-footer");
    const modal_close = LogSig.ModalClose();
    modal_close.classList.add("btn", "btn-secondary");
    modal_close.textContent = "Close";
    modal_footer.append(modal_close);
    const modal_submit = document.createElement("button");
    modal_submit.classList.add("btn", "btn-primary");
    modal_submit.type = "submit";
    modal_submit.textContent = submit_text;
    modal_footer.append(modal_submit);
    return modal_footer;
  };
}
