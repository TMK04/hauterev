import type { MockedAnyFn } from "../../../types";
import type { User } from "db/types";

import { deleteBob, deleteBobAuthed, postBob } from "../helpers";
jest.mock("db");
import { user_db } from "db";

const users: Record<string, User> = {};

(<MockedAnyFn>user_db.insertUser).mockImplementation((user: User) => {
  const { username } = user;
  if (users[username]) throw Error();
  users[username] = user;
});
(<MockedAnyFn>user_db.deleteUserByUsername).mockImplementation(
  (username: User["username"]) => delete users[username]
);
(<MockedAnyFn>user_db.selectPasswordHashByUsername).mockImplementation(
  (username: User["username"]) => {
    const password_hash = users[username]?.password_hash;
    return password_hash ? [{ password_hash }] : [];
  }
);

beforeEach(postBob);
afterEach(deleteBobAuthed);

describe("DELETE /users/:username", () => {
  describe("Given a correct password", () => {
    it("should return a 204", () => deleteBobAuthed().expect(204));
  });

  describe("Given an incorrect password", () => {
    it("should return a 401", () => deleteBob().send({ password: "A" }).expect(401));
  });

  describe("If the user does not exist", () => {
    it("should return a 404", async () => {
      await deleteBobAuthed();
      return deleteBobAuthed().expect(404);
    });
  });
});
