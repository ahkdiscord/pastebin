<script lang="ts">
  import { EditorView } from "codemirror";
  import { onDestroy, onMount } from "svelte";

  interface Props {
    content: string;
  }

  const { content = $bindable() }: Props = $props();

  let wrapper: HTMLDivElement;
  let view: EditorView | undefined;

  onMount(() => {
    view = new EditorView({
      parent: wrapper,
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
