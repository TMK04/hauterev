import supertest from "supertest";

import type { MockedFunction } from "ts-jest";

jest.mock("database/queries");

import { selectRestaurants } from "database/queries";
import server from "server";

/*
  It does not matter what values are returned;
  If the result is empty, it is up to the client side to render it so.
*/
(<MockedFunction<any>>selectRestaurants).mockReturnValue([]);

describe("restaurants-router", () => {
  describe("GET /restaurants", () => {
    describe("Given no query parameters", () => {
      it("should return a 200", () => supertest(server).get("/restaurants").expect(200));
    });

    describe("Given valid query parameters", () => {
      it("should return a 200", () =>
        supertest(server).get("/restaurants?search=Corner&region=South&rating=2").expect(200));
    });

    describe("Given invalid query parameters", () => {
      it("Given invalid query parameters, it should return a 200", () =>
        supertest(server)
          .get("/restaurants?search=&region=S&rating=invalid&unimplemented=s")
          .expect(200));
    });
  });
});
