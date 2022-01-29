import * as Components from "./Components";

for (const Component in Components)
  customElements.define(
    `hr${Component.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)}`,
    (<any>Components)[Component]
  );
