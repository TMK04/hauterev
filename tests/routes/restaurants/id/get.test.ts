import type { MockedAnyFn } from "../../../types";

import { sserver } from "../../../helpers";
jest.mock("database/queries");
import { selectRestaurantByID } from "database/queries";

(<MockedAnyFn>selectRestaurantByID).mockImplementation((id: number) => (id === 1 ? ["Found"] : []));

describe("GET /restaurants/:id", () => {
  describe("Given a valid id", () => {
    it("should return a 200", () => sserver.get("/restaurants/1").expect(200));
  });

  describe("Given an invalid id", () => {
    it("should return a 404", () => sserver.get("/restaurants/0").expect(404));
  });
});
