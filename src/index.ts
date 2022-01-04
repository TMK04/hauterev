import { config } from "dotenv-safe";

// Initialize environment variables.
config();

import { express_config } from "configs";
import server from "server";

const { port, hostname } = express_config;

server.listen(port, hostname, () => console.log(`Listening on http://${hostname}:${port}`));
