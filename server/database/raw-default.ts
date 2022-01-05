import type { RawDefault } from "./queries/types";

import db from "database";

const raw_default: RawDefault = db.raw("DEFAULT");

export default raw_default;
