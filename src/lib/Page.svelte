<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    children: Snippet;
    headerStart: Snippet;
    headerEnd: Snippet;
  }

  let { children, headerStart, headerEnd } = $props();
</script>

<div class="page">
  <header>
    <div class="together">
      {@render headerStart()}
    </div>
    <div class="together">
      {@render headerEnd()}
    </div>
  </header>

  <main>
    {@render children()}
  </main>
</div>

<style>
  .page {
    display: grid;
    grid-template-rows: auto 1fr;
    min-height: 100%;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5em;

    padding: 0.5em;

    background-color: var(--black);

    position: sticky;
    top: 0;
    z-index: 10;
  }

  .together {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: inherit;
  }
</style>
