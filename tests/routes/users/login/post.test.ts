import type { MockedAnyFn } from "../../../types";
import type { User } from "database/queries/types";

import { post } from "../../../helpers";
import { deleteBob, postBob } from "../helpers";
jest.mock("database/queries");
import { insertUser, deleteUserByUsername, selectPasswordHashByUsername } from "database/queries";

const users: Record<string, User> = {};

(<MockedAnyFn>insertUser).mockImplementation((user: User) => {
  const { username } = user;
  if (users[username]) throw Error();
  users[username] = user;
});
(<MockedAnyFn>deleteUserByUsername).mockImplementation(
  (username: User["username"]) => delete users[username]
);
(<MockedAnyFn>selectPasswordHashByUsername).mockImplementation((username: User["username"]) => {
  const password_hash = users[username]?.password_hash;
  return password_hash ? [{ password_hash }] : [];
});

beforeAll(postBob);
afterAll(deleteBob);

describe("POST /users/login", () => {
  describe("Given a valid body", () => {
    it("should return a 200", () =>
      post("/users/login", {
        username: "Bob123",
        password: "Bob123Builder"
      }).expect(200));
  });

  describe("Given an invalid body", () => {
    it("should return a 400", () => post("/users/login", {}).expect(400));
  });

  describe("Given an incorrect body", () => {
    it("should return a 401", () =>
      post("/users/login", {
        username: "Bob123",
        password: "Bob123"
      }).expect(401));
  });

  describe("If the user does not exist", () => {
    it("should return a 404", () =>
      post("/users/login", {
        username: "Bob132",
        password: "Bob123Builder"
      }).expect(404));
  });
});
