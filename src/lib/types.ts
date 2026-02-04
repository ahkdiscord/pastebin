import { literal, type infer as inferred } from "zod";

export const Version = literal(["v1.1", "v2.0"]);
export type Version = inferred<typeof Version>;
