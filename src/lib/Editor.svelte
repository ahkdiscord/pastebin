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
  import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
  import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { highlightSelectionMatches } from "@codemirror/search";

  interface Props {
    content: string;
  }

  let { content = $bindable() }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined;

  const tabSize = new Compartment();

  const state = EditorState.create({
    // svelte-ignore state_referenced_locally
    doc: content,
    extensions: [
      lineNumbers(),
      drawSelection(),
      keymap.of([...defaultKeymap, ...closeBracketsKeymap, indentWithTab]),
      history(),
      tabSize.of(EditorState.tabSize.of(4)),
      foldGutter(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      highlightActiveLineGutter(),
      highlightSelectionMatches(),
      highlightSpecialChars(),
      EditorView.theme(
        {
          "&.cm-editor": {
            overflow: "hidden",
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
    ],
  });

  onMount(() => {
    view = new EditorView({
      parent: wrapper,
      state,
    });
  });

  $effect(() => {
    if (view && content !== view.state.doc.toString()) {
      view?.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: content } });
    }
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
