import { user_auth_controller } from "controllers";
import { users_middlewares } from "middlewares";

import { MergeRouter } from "./utils";

const user_auth_router = MergeRouter();

user_auth_router
  .use("/logout", users_middlewares.authenticate, users_middlewares.rejectUnauthenticated)
  .route("/logout")
  .post(user_auth_controller.logout);

export default user_auth_router;
