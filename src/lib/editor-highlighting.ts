import { styleTags, tags } from "@lezer/highlight";
import { parser } from "./autohotkey";
import { foldInside, foldNodeProp, indentNodeProp, LRLanguage } from "@codemirror/language";
import { completeFromList } from "@codemirror/autocomplete";

const parserWithMetadata = parser.configure({
  props: [
    styleTags({
      Identifier: tags.variableName,
      Boolean: tags.bool,
      String: tags.string,
      LineComment: tags.lineComment,
      "( )": tags.paren,
    }),
    indentNodeProp.add({
      Application: context => context.column(context.node.from) + context.unit,
    }),
    foldNodeProp.add({
      Application: foldInside,
    }),
  ],
});

export const autohotkeyLanguage = LRLanguage.define({
  parser: parserWithMetadata,
  languageData: {
    commentTokens: { line: ";" },
  },
});

export const autohotkeyCompletion = autohotkeyLanguage.data.of({
  autocomplete: completeFromList([
    {label: "defun", type: "keyword"},
    {label: "defvar", type: "keyword"},
    {label: "let", type: "keyword"},
    {label: "cons", type: "function"},
    {label: "car", type: "function"},
    {label: "cdr", type: "function"},
  ]),
});