export const versions = ["v1.1", "v2.0"] as const;
export type Version = (typeof versions)[number];
export function isVersion(x: unknown): x is Version {
  return typeof x === "string" && (versions as readonly string[]).includes(x);
}