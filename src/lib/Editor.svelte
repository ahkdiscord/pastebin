<script lang="ts">
  import { Compartment, EditorState, type Extension } from "@codemirror/state";
  import { EditorView } from "codemirror";
  import {
    drawSelection,
    dropCursor,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection,
  } from "@codemirror/view";
  import { onDestroy, onMount } from "svelte";
  import { defaultKeymap, history, indentWithTab } from "@codemirror/commands";
  import {
    bracketMatching,
    foldGutter,
    HighlightStyle,
    indentOnInput,
    LanguageSupport,
    syntaxHighlighting,
  } from "@codemirror/language";
  import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { highlightSelectionMatches } from "@codemirror/search";
  import { getLrLanguage } from "./editor-highlighting";
  import { tags } from "@lezer/highlight";
  import type { Language } from "./Language";

  interface Props {
    content: string;
    language: Language;
    readOnly?: boolean;
    tabSize?: number;
  }

  let { content = $bindable(), language, readOnly = false, tabSize = 4 }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined = $state(undefined);

  const tabSizeCompartment = new Compartment();
  $effect(() => {
    view?.dispatch({
      effects: tabSizeCompartment.reconfigure(EditorState.tabSize.of(tabSize)),
    });
  });

  const readOnlyCompartment = new Compartment();
  $effect(() => {
    view?.dispatch({
      effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly)),
    });
  });

  const languageSupportCompartment = new Compartment();
  $effect(() => {
    view?.dispatch({
      effects: languageSupportCompartment.reconfigure(getLanguageSupport(language)),
    });
  });

  function getLanguageSupport(language: Language): Extension {
    const lrLanguage = getLrLanguage(language);

    if (!lrLanguage) return [];

    return new LanguageSupport(lrLanguage);
  }

  const editorState = EditorState.create({
    // svelte-ignore state_referenced_locally
    doc: content,
    extensions: [
      // svelte-ignore state_referenced_locally
      languageSupportCompartment.of(getLanguageSupport(language)),

      lineNumbers(),
      foldGutter(),

      drawSelection(),
      rectangularSelection(),
      EditorState.allowMultipleSelections.of(true),

      // svelte-ignore state_referenced_locally
      tabSizeCompartment.of(EditorState.tabSize.of(tabSize)),
      indentOnInput(),

      closeBrackets(),
      autocompletion(),

      history(),

      bracketMatching(),
      highlightActiveLineGutter(),
      highlightSelectionMatches(),
      highlightSpecialChars(),

      dropCursor(),

      // svelte-ignore state_referenced_locally
      readOnlyCompartment.of(EditorState.readOnly.of(readOnly)),

      keymap.of([...defaultKeymap, ...closeBracketsKeymap, indentWithTab]),

      EditorView.theme({}, { dark: true }),

      EditorState.transactionExtender.of(transaction => {
        if (!transaction.docChanged) return null;

        const string = transaction.newDoc.toString();

        content = string;

        return null;
      }),

      syntaxHighlighting(
        HighlightStyle.define([
          { tag: tags.comment, class: "comment" },
          { tag: tags.lineComment, class: "comment" },
          { tag: tags.blockComment, class: "comment" },
          { tag: tags.bool, class: "bool" },
          { tag: tags.keyword, class: "keyword" },
          { tag: tags.controlKeyword, class: "keyword" },
          { tag: tags.variableName, class: "variable" },
          { tag: tags.propertyName, class: "variable" },
          { tag: tags.labelName, class: "label" },
          { tag: tags.integer, class: "number" },
          { tag: tags.string, class: "string" },
          { tag: tags.escape, class: "escape" },
          { tag: tags.className, class: "class" },
          { tag: tags.modifier, class: "modifier" },
          { tag: tags.name, class: "name" },
          { tag: tags.definitionOperator, class: "definition operator" },
          { tag: tags.standard(tags.className), class: "builtin class constant" },
          { tag: tags.function(tags.name), class: "function" },
          { tag: tags.function(tags.keyword), class: "function keyword" },
          { tag: tags.standard(tags.variableName), class: "builtin variable" },
          { tag: tags.standard(tags.constant(tags.variableName)), class: "builtin constant" },
          { tag: tags.standard(tags.function(tags.variableName)), class: "builtin function" },
        ]),
      ),
    ],
  });

  $effect(() => {
    if (view) {
      wrapper.replaceChildren(view.dom);
    } else {
      wrapper.replaceChildren();
    }
  });

  onMount(() => {
    view = new EditorView({
      state: editorState,
    });
  });

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div class="editor" bind:this={wrapper}></div>

<style>
  .editor {
    display: contents;
  }

  .editor :global(.cm-editor) {
    height: 100%;
  }

  .editor :global(.cm-content) {
    background-color: var(--night);
    border-start-start-radius: 0.5em;
    border-end-start-radius: 0.5em;
  }

  .editor :global(.cm-line) {
    position: relative;
    z-index: 1;
  }

  .editor :global(.cm-focused) {
    outline: none;
  }

  .editor :global(.cm-gutters) {
    background-color: var(--black);
  }

  .editor :global(.cm-activeLine) {
    background-color: var(--slate);
  }

  .editor :global(.cm-selectionLayer) {
    z-index: unset !important;
  }

  .editor :global(.cm-selectionBackground) {
    background-color: var(--smoke) !important;
    opacity: 0.5;
  }

  .editor :global(.cm-focused .cm-selectionBackground) {
    opacity: 1;
  }

  .editor :global(.cm-selectionMatch) {
    background-color: color-mix(in srgb, var(--slime) 25%, transparent);
  }

  .editor :global(.comment) {
    color: var(--dusty);
  }

  .editor :global(.bool) {
    color: var(--berry);
  }

  .editor :global(.number) {
    color: var(--berry);
  }

  .editor :global(.keyword) {
    color: var(--blush);
  }

  .editor :global(.variable) {
    color: var(--paper);
  }

  .editor :global(.class) {
    color: var(--magic);
  }

  .editor :global(.string) {
    color: var(--royal);
  }

  .editor :global(.escape) {
    color: var(--peach);
  }

  .editor :global(.function) {
    color: var(--slush);
  }

  .editor :global(.function.keyword) {
    font-weight: bolder;
  }

  .editor :global(.constant) {
    font-style: italic;
  }

  .editor :global(.builtin) {
    font-weight: bolder;
  }

  .editor :global(.modifier) {
    color: var(--slime);
  }

  .editor :global(.operator) {
    color: var(--white);
  }

  .editor :global(.definition.operator) {
    font-weight: bolder;
  }

  .editor :global(.label) {
    color: var(--slime);
  }
</style>
