import { styleTags, Tag, tags } from "@lezer/highlight";
import { LRParser } from "@lezer/lr";
import { parser as ahkV11Parser } from "./parsing/ahk-v1.1.gen";
import { parser as ahkV20Parser } from "./parsing/ahk-v2.0.gen";
import { LRLanguage } from "@codemirror/language";
import type { Language } from "./Language";

export const customTags = {
  error: Tag.define("error"),
};

function parserWithMetadata(baseParser: LRParser) {
  return baseParser.configure({
    props: [
      styleTags({
        "⚠": customTags.error,
        "BlockComment": tags.blockComment,
        "Directive": tags.keyword,
        "Directive/Boolean": tags.bool,
        "Directive/Keyword": tags.keyword,
        "Directive/String": tags.string,
        "Label/Name": tags.labelName,
        "LineComment": tags.lineComment,
      }),
    ],
  });
}

export function getLrLanguage(language: Language) {
  if (language === "ahkv1.1") {
    return LRLanguage.define({
      parser: parserWithMetadata(ahkV11Parser),
    });
  }
  if (language === "ahkv2.0") {
    return LRLanguage.define({
      parser: parserWithMetadata(ahkV20Parser),
    });
  }
}
