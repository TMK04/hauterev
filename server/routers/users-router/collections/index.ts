import { rejectUnauthenticated } from "../helpers";
import users_router from "../router";

users_router.use("/:username/:collection", rejectUnauthenticated);

import "./bookmarks-collection";
import "./helpful-marks-collection";
