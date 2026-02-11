import { styleTags, tags } from "@lezer/highlight";
import { LRParser } from "@lezer/lr";
import { parser as ahkV11Parser } from "./parsing/ahk-v1.1.gen";
import { parser as ahkV20Parser } from "./parsing/ahk-v2.0.gen";
import { LRLanguage } from "@codemirror/language";
import type { Language } from "./Language";

function parserWithMetadata(baseParser: LRParser) {
  return baseParser.configure({
    props: [
      styleTags({
        "( )": tags.paren,
        "[ ]": tags.squareBracket,
        "{ }": tags.brace,
        "BlockComment": tags.blockComment,
        "Boolean": tags.bool,
        "BuiltinClass": tags.standard(tags.className),
        "BuiltinConstant": tags.standard(tags.constant(tags.variableName)),
        "BuiltinFunction": tags.standard(tags.function(tags.variableName)),
        "BuiltinVariable": tags.standard(tags.variableName),
        "Class": tags.keyword,
        "ClassName": tags.className,
        "ControlFlowKeyword": tags.controlKeyword,
        "Directive": tags.keyword,
        "DirectiveBoolean": tags.bool,
        "DirectiveKeyword": tags.keyword,
        "DirectiveString": tags.string,
        "EscapeSequence": tags.escape,
        "Extends": tags.keyword,
        "Float": tags.float,
        "FunctionName": tags.function(tags.name),
        "Get Set": tags.function(tags.keyword),
        "HotkeyModifiers": tags.macroName,
        "HotkeyName": tags.macroName,
        "Integer": tags.integer,
        "IsSet": tags.operatorKeyword,
        "LabelName": tags.labelName,
        "LineComment": tags.lineComment,
        "Name": tags.name,
        "Not And Or": tags.logicOperator,
        "ParameterName": tags.variableName,
        "PropertyName": tags.propertyName,
        "QuotedDirectiveString": tags.string,
        "Reference": tags.definitionOperator,
        "Static": tags.modifier,
        "String": tags.string,
        "UnquotedDirectiveString": tags.string,
        "Unset": tags.null,
        "VariableName": tags.variableName,
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
