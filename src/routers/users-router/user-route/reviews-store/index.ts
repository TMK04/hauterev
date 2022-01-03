import users_router from "../../router";

import { rejectUnauthorized } from "./helpers";

import "./route";

users_router.use("/:username/reviews/:id", rejectUnauthorized);

import "./review-route";
