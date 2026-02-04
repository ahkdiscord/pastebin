import { styleTags, tags } from "@lezer/highlight";
import { LRParser } from "@lezer/lr";
import { parser as ahkV11Parser } from "./parsing/ahk-v1.1.gen";
import { parser as ahkV20Parser } from "./parsing/ahk-v2.0.gen";
import { foldInside, foldNodeProp, indentNodeProp, LRLanguage } from "@codemirror/language";
import type { Version } from "./types";

function parserWithMetadata(baseParser: LRParser) {
  return baseParser.configure({
    props: [
      styleTags({
        Identifier: tags.variableName,
        Boolean: tags.bool,
        String: tags.string,
        EscapeSequence: tags.escape,
        LineComment: tags.lineComment,
        BlockComment: tags.blockComment,
        BuiltinVariable: tags.standard(tags.variableName),
        BuiltinConstant: tags.standard(tags.constant(tags.variableName)),
        BuiltinFunction: tags.standard(tags.function(tags.variableName)),
      }),
      indentNodeProp.add({
        Application: context => context.column(context.node.from) + context.unit,
      }),
      foldNodeProp.add({
        Application: foldInside,
      }),
    ],
  });
}

export function autohotkeyLanguage(version: Version) {
  return LRLanguage.define({
    parser:
      version === "v1.1"
        ? parserWithMetadata(ahkV11Parser)
        : version === "v2.0"
          ? parserWithMetadata(ahkV20Parser)
          : (version satisfies never),
    languageData: {
      commentTokens: { line: ";" },
    },
  });
}
