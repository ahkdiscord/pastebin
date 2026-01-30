<script lang="ts">
  import { Compartment, EditorState } from "@codemirror/state";
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
  import { bracketMatching, foldGutter, HighlightStyle, indentOnInput, LanguageSupport, syntaxHighlighting } from "@codemirror/language";
  import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { highlightSelectionMatches } from "@codemirror/search";
  import { autohotkeyCompletion, autohotkeyLanguage } from "./editor-highlighting";
  import { tags } from "@lezer/highlight";

  interface Props {
    content: string;
    readOnly?: boolean;
    tabSize?: number;
  }

  let { content = $bindable(), readOnly = false, tabSize = 4 }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined = $state(undefined);

  const tabSizeCompartment = new Compartment();
  $effect(() => {
    tabSizeCompartment.reconfigure(EditorState.tabSize.of(tabSize));
  });

  const readOnlyCompartment = new Compartment();
  $effect(() => {
    readOnlyCompartment.reconfigure(EditorState.readOnly.of(readOnly));
  });

  const editorState = EditorState.create({
    // svelte-ignore state_referenced_locally
    doc: content,
    extensions: [
      new LanguageSupport(autohotkeyLanguage, [autohotkeyCompletion]),

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
      
      EditorView.theme(
        {
          "&.cm-editor": {
            height: "100%",
            backgroundColor: "var(--night)",
          },
          "&.cm-focused": {
            outline: "none",
          },
          ".cm-gutters": {
            backgroundColor: "var(--black)",
          },
          ".cm-activeLine": {
            backgroundColor: "var(--slate)",
          },
          ".cm-selectionBackground": {
            backgroundColor: "var(--smoke)",
          },
          "&.cm-focused .cm-selectionBackground": {
            backgroundColor: "var(--smoke) !important",
          },
          ".cm-selectionMatch": {
            backgroundColor: "color-mix(in srgb, var(--slime) 25%, transparent)",
          },
        },
        { dark: true },
      ),
      
      EditorState.transactionExtender.of(transaction => {
        if (!transaction.docChanged) return null;

        const string = transaction.newDoc.toString();

        content = string;

        return null;
      }),

      syntaxHighlighting(HighlightStyle.define([
        { tag: tags.lineComment, color: "gray" }
      ])),
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
</style>
