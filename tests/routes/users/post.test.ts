import type { MockedAnyFn } from "../../types";
import type { User } from "db/types";

import { post } from "../../helpers";
jest.mock("db");
import { user_db } from "db";

import { deleteBobAuthed, postBob } from "./helpers";

const users: Record<string, User> = {};

(<MockedAnyFn>user_db.insertUser).mockImplementation((user: User) => {
  const { username } = user;
  if (users[username]) throw Error();
  users[username] = user;
});
(<MockedAnyFn>user_db.deleteUserByUsername).mockImplementation((username: User["username"]) => {
  if (username) delete users[username];
});

afterEach(deleteBobAuthed);

describe("POST /users", () => {
  describe("Given valid body parameters", () => {
    it("should return a 201", () => postBob().expect(201));
  });

  describe("Given invalid body parameters", () => {
    it("should return a 400", () => post("/users", {}).expect(400));
  });

  describe("If username conflicts with existing user", () => {
    it("should return a 500", async () => {
      await postBob();
      return postBob().expect(500);
    });
  });
});
