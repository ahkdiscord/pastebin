import { literal, type infer as inferred } from "zod";

export const Language = literal(["none", "ahkv1.1", "ahkv2.0"]);

export type Language = inferred<typeof Language>;

export function getDisplayNames(language: Language): { long: string; short: string } {
  switch (language) {
    case "ahkv1.1":
      return { long: "AutoHotkey v1.1", short: "AHK v1" };
    case "ahkv2.0":
      return { long: "AutoHotkey v2.0", short: "AHK v2" };
    case "none":
      return { long: "Plain Text", short: "Text" };
  }
}
