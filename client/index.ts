import { tag } from "helpers";

import * as Components from "./Components";

for (const Component in Components)
  customElements.define(tag(Component), (<any>Components)[Component]);
