import type { MockedAnyFn } from "../../types";

import { sserver } from "../../helpers";
jest.mock("database/queries");
import { selectRestaurants } from "database/queries";

/*
  It does not matter what values are returned;
  If the result is empty, it is up to the client side to render it so.
*/
(<MockedAnyFn>selectRestaurants).mockReturnValue([]);

describe("GET /restaurants", () => {
  describe("Given no query parameters", () => {
    it("should return a 200", () => sserver.get("/restaurants").expect(200));
  });

  describe("Given valid query parameters", () => {
    it("should return a 200", () =>
      sserver.get("/restaurants?search=Corner&region=South&rating=2").expect(200));
  });

  describe("Given invalid query parameters", () => {
    it("Given invalid query parameters, it should return a 200", () =>
      sserver.get("/restaurants?search=&region=S&rating=invalid&unimplemented=s").expect(200));
  });
});
