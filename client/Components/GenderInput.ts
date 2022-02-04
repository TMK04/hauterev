import { createElement } from "helpers";

export default class GenderInput extends HTMLElement {
  static id = "gender-input";

  constructor(prefix?: string) {
    super();

    const select = createElement("select", ["form-select"]);
    select.classList.add("form-select");
    if (prefix) select.id += `${prefix}-`;
    select.id += GenderInput.id;
    select.name = "gender";
    const select_n = createElement("option");
    select_n.value = "M";
    select_n.textContent = "Choose...";
    select_n.selected = true;
    const select_m = createElement("option");
    select_m.value = "M";
    select_m.textContent = "Male";
    const select_f = createElement("option");
    select_f.value = "F";
    select_f.textContent = "Female";
    const select_o = createElement("option");
    select_o.value = "O";
    select_o.textContent = "Other";
    select.append(select_n, select_m, select_f, select_o);
    this.append(select);
  }
}
