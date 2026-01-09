<script lang="ts">
  import { Compartment, EditorState } from "@codemirror/state";
  import { EditorView } from "codemirror";
  import {
    drawSelection,
    dropCursor,
    highlightActiveLine,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection,
  } from "@codemirror/view";
  import { onDestroy, onMount } from "svelte";
  import { defaultKeymap, history } from "@codemirror/commands";
  import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
  import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { highlightSelectionMatches } from "@codemirror/search";

  interface Props {
    content: string;
  }

  const { content = $bindable() }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined;

  const tabSize = new Compartment();

  const state = EditorState.create({
    extensions: [
      lineNumbers(),
      drawSelection(),
      keymap.of([...defaultKeymap, ...closeBracketsKeymap]),
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
      highlightActiveLine(),
      highlightActiveLineGutter(),
      highlightSelectionMatches(),
      highlightSpecialChars(),
      EditorView.theme({}, { dark: true }),
    ],
  });

  onMount(() => {
    view = new EditorView({
      parent: wrapper,
      state,
    });

    console.log(view);
  });

  onDestroy(() => {
    view?.destroy();
  });
</script>

<div id="editor" bind:this={wrapper}></div>

<style>
  #editor {
    display: contents;
  }
</style>
