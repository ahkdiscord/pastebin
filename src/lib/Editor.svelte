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

  const editorState = EditorState.create({
    // svelte-ignore state_referenced_locally
    doc: content,
    extensions: [
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

  .editor :global(.unset) {
    color: var(--berry);
  }

  .editor :global(.hotkey) {
    color: var(--slime);
  }
</style>
