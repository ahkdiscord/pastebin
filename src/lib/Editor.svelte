<script lang="ts">
  import { Compartment, EditorState, Range, RangeSet } from "@codemirror/state";
  import { EditorView } from "codemirror";
  import {
    Decoration,
    drawSelection,
    dropCursor,
    highlightActiveLineGutter,
    highlightSpecialChars,
    keymap,
    lineNumbers,
    rectangularSelection,
    type DecorationSet,
  } from "@codemirror/view";
  import { onDestroy, onMount } from "svelte";
  import { defaultKeymap, history, indentWithTab } from "@codemirror/commands";
  import { bracketMatching, foldGutter, indentOnInput } from "@codemirror/language";
  import { autocompletion, closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
  import { highlightSelectionMatches } from "@codemirror/search";
  import type { Language } from "./Language";
  import { Parser, Language as TreeSitterLanguage } from "web-tree-sitter";
  import wasmUrl from "web-tree-sitter/web-tree-sitter.wasm?url";
  import autohotkeyV2WasmUrl from "tree-sitter-autohotkey-v2/tree-sitter-autohotkey_v2.wasm?url";
  import type { Tree } from "web-tree-sitter";
  import { dev } from "$app/environment";

  interface Props {
    content: string;
    language: Language;
    readOnly?: boolean;
    tabSize?: number;
  }

  let { content = $bindable(), language, readOnly = false, tabSize = 4 }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined = $state(undefined);
  let parser: Parser | undefined = $state(undefined);
  let tree: Tree | undefined = $state(undefined);
  let decorations: DecorationSet = RangeSet.empty;

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

      EditorView.decorations.of(getDecorations),

      EditorState.transactionExtender.of(transaction => {
        if (!transaction.docChanged) return null;

        const doc = transaction.newDoc.toString();

        tree = parser?.parse(doc)!;

        decorations = computeDecorations(tree);

        content = doc;

        if (dev) {
          console.log(tree.rootNode.toString());
        }

        return null;
      }),
    ],
  });

  function computeDecorations(tree: Tree) {
    const ranges: Range<Decoration>[] = [];

    const iter = tree.walk();

    do {
      if (iter.startIndex === iter.endIndex) continue;
      if (iter.currentNode.type === "source_file") continue;
      ranges.push(Decoration.mark({ class: iter.currentNode.type }).range(iter.startIndex, iter.endIndex));
    } while (iter.gotoFirstChild() || iter.gotoNextSibling() || (iter.gotoParent() && iter.gotoNextSibling()));

    iter.delete();

    return RangeSet.of(ranges);
  }

  function getDecorations(): DecorationSet {
    return decorations;
  }

  $effect(() => {
    if (view) {
      wrapper.replaceChildren(view.dom);
    } else {
      wrapper.replaceChildren();
    }
  });

  onMount(async () => {
    view = new EditorView({
      state: editorState,
    });

    Parser.init({
      locateFile() {
        return wasmUrl;
      },
    })
      .then(() => {
        parser = new Parser();
        return TreeSitterLanguage.load(autohotkeyV2WasmUrl);
      })
      .then(lang => {
        parser!.setLanguage(lang);
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

  .editor :global(.directive) {
    color: var(--blush);
  }

  .editor :global(.integer) {
    color: var(--berry);
  }

  .editor :global(.string) {
    color: var(--royal);
  }

  .editor :global(.string .escape) {
    color: var(--peach);
  }

  .editor :global(.label .name) {
    color: var(--slime);
  }
</style>
