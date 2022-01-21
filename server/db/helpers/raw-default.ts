import type { RawDefault } from "../types";

import { db } from "connections";

const raw_default: RawDefault = db.raw("DEFAULT");

export default raw_default;
