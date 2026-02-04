<script lang="ts">
  import { EditorState } from "@codemirror/state";
  import { EditorView } from "codemirror";
  import { drawSelection } from "@codemirror/view";
  import { onDestroy, onMount } from "svelte";
  import { highlightSelectionMatches } from "@codemirror/search";

  interface Props {
    content: string;
  }

  let { content }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined = $state(undefined);

  const editorState = EditorState.create({
    // svelte-ignore state_referenced_locally
    doc: content,
    extensions: [
      drawSelection(),

      highlightSelectionMatches(),

      EditorState.readOnly.of(true),

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
    ],
  });

  $effect(() => {
    view?.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: content,
      },
    });
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

<div class="output" bind:this={wrapper}></div>

<style>
  .output {
    display: contents;
  }
</style>
