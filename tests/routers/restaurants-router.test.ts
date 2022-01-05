import type { MockedAnyFn } from "../types";

import { sserver } from "../helpers";
jest.mock("database/queries");
import { selectRestaurants, selectRestaurantByID } from "database/queries";

/*
  It does not matter what values are returned;
  If the result is empty, it is up to the client side to render it so.
*/
(<MockedAnyFn>selectRestaurants).mockReturnValue([]);
(<MockedAnyFn>selectRestaurantByID).mockImplementation((id: number) => (id === 1 ? ["Found"] : []));

describe("restaurants-router", () => {
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

  describe("GET /restaurants/:id", () => {
    describe("Given a valid id", () => {
      it("should return a 200", () => sserver.get("/restaurants/1").expect(200));
    });

    describe("Given an invalid id", () => {
      it("should return a 404", () => sserver.get("/restaurants/0").expect(404));
    });
  });
});
