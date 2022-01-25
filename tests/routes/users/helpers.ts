import { post, sserver } from "../../helpers";

export const postBob = () =>
  post("/api/users", {
    username: "Bob123",
    password: "Bob123Builder",
    email: "bob_staub_123@mail.com",
    last_name: "Staub",
    first_name: "Bob",
    mobile_number: "12345678",
    address: "Staub Street 123",
    gender: "M"
  });

export const deleteBob = () => sserver.del("/api/users/Bob123");

export const deleteBobAuthed = () => deleteBob().send({ password: "Bob123Builder" });
