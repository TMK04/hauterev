import type { MockedAnyFn } from "../../../types";

import { sserver } from "../../../helpers";
jest.mock("db");
import { restaurant_db } from "db";

(<MockedAnyFn>restaurant_db.selectRestaurantByID).mockImplementation((id: number) =>
  id === 1 ? ["Found"] : []
);

describe("GET /api/restaurants/:id", () => {
  describe("Given a valid id", () => {
    it("should return a 200", () => sserver.get("/api/restaurants/1").expect(200));
  });

  describe("Given an invalid id", () => {
    it("should return a 404", () => sserver.get("/api/restaurants/0").expect(404));
  });
});
