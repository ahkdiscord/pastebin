import { styleTags, tags } from "@lezer/highlight";
import { LRParser } from "@lezer/lr";
import { parser as ahkV11Parser } from "./parsing/ahk-v1.1.gen";
import { parser as ahkV20Parser } from "./parsing/ahk-v2.0.gen";
import { foldInside, foldNodeProp, indentNodeProp, LRLanguage } from "@codemirror/language";
import type { Language } from "./Language";

function parserWithMetadata(baseParser: LRParser) {
  return baseParser.configure({
    props: [
      styleTags({
        "Name": tags.name,
        "VariableName": tags.variableName,
        "PropertyName": tags.propertyName,
        "ParameterName": tags.variableName,
        "FunctionName": tags.function(tags.name),
        "Boolean": tags.bool,
        "DirectiveBoolean": tags.bool,
        "Integer": tags.integer,
        "String": tags.string,
        "EscapeSequence": tags.escape,
        "LineComment": tags.lineComment,
        "BlockComment": tags.blockComment,
        "BuiltinVariable": tags.standard(tags.variableName),
        "BuiltinConstant": tags.standard(tags.constant(tags.variableName)),
        "BuiltinFunction": tags.standard(tags.function(tags.variableName)),
        "BuiltinClass": tags.standard(tags.className),
        "ClassName": tags.className,
        "ControlFlow": tags.controlKeyword,
        "Directive": tags.keyword,
        "Class": tags.keyword,
        "Extends": tags.keyword,
        "Static": tags.modifier,
        "Get Set": tags.function(tags.keyword),
        "Reference": tags.definitionOperator,
        "{ }": tags.brace,
        "[ ]": tags.squareBracket,
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
