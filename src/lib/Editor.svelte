<script lang="ts">
  import { Compartment, EditorState, Range, RangeSet, Text } from "@codemirror/state";
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
  import { Edit, Parser, Language as TreeSitterLanguage } from "web-tree-sitter";
  import wasmUrl from "web-tree-sitter/web-tree-sitter.wasm?url";
  import autohotkeyV2WasmUrl from "tree-sitter-autohotkey-v2/tree-sitter-autohotkey_v2.wasm?url";
  import { Tree } from "web-tree-sitter";
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
  let decorations: DecorationSet = $state(RangeSet.empty);
  let tree: Tree | undefined = $state(undefined);

  const decorationsCompartment = new Compartment();
  $effect(() => {
    view?.dispatch({
      effects: decorationsCompartment.reconfigure(EditorView.decorations.of(decorations)),
    });
  });

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

      // svelte-ignore state_referenced_locally
      decorationsCompartment.of(EditorView.decorations.of(decorations)),

      EditorState.transactionExtender.of(transaction => {
        if (!transaction.docChanged) return null;

        transaction.changes.iterChangedRanges(editTree);

        const doc = transaction.newDoc.toString();

        content = doc;

        highlight(doc);

        return null;
      }),
    ],
  });

  function editTree(oldFrom: number, oldTo: number, newFrom: number, newTo: number) {
    if (oldFrom !== newFrom) console.warn("oldFrom !== newFrom");

    tree?.edit(
      new Edit({
        startIndex: oldFrom,
        startPosition: findPos(oldFrom),
        oldEndIndex: oldTo,
        oldEndPosition: findPos(oldTo),
        newEndIndex: newTo,
        newEndPosition: findPos(newTo),
      }),
    );

    function findPos(index: number): { column: number; row: number } {
      const before = content.slice(0, index);
      return {
        row: before.match(/\n/g)?.length ?? 0,
        column: before.slice(before.lastIndexOf("\n")).length,
      };
    }
  }

  function highlight(doc?: string) {
    tree = parser?.parse(doc ?? editorState.doc.toString(), tree) ?? undefined;

    if (tree) {
      decorations = computeDecorations(tree);

      if (dev) {
        console.log(tree.rootNode.toString());
      }
    } else {
      decorations = RangeSet.empty;
    }
  }

  function computeDecorations(tree: Tree) {
    const ranges: Range<Decoration>[] = [];

    const iter = tree.walk();

    function visit() {
      if (iter.startIndex === iter.endIndex) return;

      if (dev) {
        console.group(iter.currentNode.type);
        console.debug(iter.currentNode.text);
      }

      if (iter.gotoFirstChild()) {
        do {
          visit();
        } while (iter.gotoNextSibling());
        iter.gotoParent();
      }

      ranges.push(Decoration.mark({ class: iter.currentNode.type.replace(/_/g, "-") }).range(iter.startIndex, iter.endIndex));

      if (dev) {
        console.groupEnd();
      }
    }

    if (iter.gotoFirstChild()) {
      do {
        visit();
      } while (iter.gotoNextSibling());
    }

    iter.delete();

    // Sort to maintain proper order
    ranges.sort((a, b) => {
      return a.from - b.from || b.to - a.to;
    });

    return RangeSet.of(ranges);
  }

  $effect(() => {
    if (view) {
      // eslint-disable-next-line svelte/no-dom-manipulating
      wrapper.replaceChildren(view.dom);
      view.focus();
    } else {
      // eslint-disable-next-line svelte/no-dom-manipulating
      wrapper.replaceChildren();
    }
  });

  $effect(() => {
    switch (language) {
      case "ahkv2.0":
        setTreeSitterLanguage(autohotkeyV2WasmUrl);
        break;
      default:
        setTreeSitterLanguage(undefined);
        break;
    }
  });

  async function setTreeSitterLanguage(url: string | undefined) {
    if (!parser) return;

    if (!url) {
      parser!.setLanguage(null);
      highlight();
      return;
    }

    const lang = await TreeSitterLanguage.load(url);
    parser!.setLanguage(lang);
    highlight();
  }

  onMount(async () => {
    view = new EditorView({
      state: editorState,
    });

    await Parser.init({
      locateFile() {
        return wasmUrl;
      },
    });
    parser = new Parser();
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

  .editor :global(.ERROR) {
    text-decoration: underline 2px var(--coral);
    text-decoration-skip-ink: none;
  }

  .editor :global(.directive) {
    color: var(--blush);
  }

  .editor :global(.integer),
  .editor :global(.float),
  .editor :global(.boolean) {
    color: var(--berry);
  }

  .editor :global(.string) {
    color: var(--royal);
  }
  .editor :global(.string .escape) {
    color: var(--peach);
  }

  .editor :global(.label-name) {
    color: var(--slime);
  }

  .editor :global(.hotkey .trigger) {
    color: var(--slime);
  }
  .editor :global(.hotkey .modifiers) {
    color: var(--berry);
  }

  .editor :global(.hotstring .options) {
    color: var(--berry);
  }
  .editor :global(.hotstring .trigger) {
    color: var(--slime);
  }
  .editor :global(.hotstring .replacement) {
    color: var(--royal);
  }

  .editor :global(.function-name) {
    color: var(--slush);
  }
  .editor :global(.variable-name) {
    color: var(--white);
  }
  .editor :global(.class-name) {
    color: var(--magic);
  }

  .editor :global(.keyword) {
    color: var(--blush);
  }
</style>
