export const versions = ["v1.1", "v2.0", "v2.1-alpha"] as const;
export type Version = (typeof versions)[number];