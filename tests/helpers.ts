import supertest from "supertest";

import server from "server";

export const sserver = supertest(server);

export const post = (url: string, data: object) =>
  sserver.post(url).set("Content-Type", "application/json").send(data);
