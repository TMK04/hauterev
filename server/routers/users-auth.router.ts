import { Router } from "express";

import { users_auth_controller } from "controllers";

const users_auth_router = Router();

users_auth_router.route("/login").post(users_auth_controller.login);

export default users_auth_router;
