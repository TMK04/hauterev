import users_router from "../router";

import { authenticate, rejectUnauthenticated } from "./helpers";

users_router.use("/:username", authenticate);

import "./route";

users_router.use("/:username/:route", rejectUnauthenticated);

import "./reviews-store";
import "./bookmarks-collection";
import "./helpful-marks-collection";
