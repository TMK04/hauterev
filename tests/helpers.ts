import supertest from "supertest";

import server from "server";

export const sserver = supertest(server);
