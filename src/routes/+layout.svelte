<script lang="ts">
  import "$lib/global.css";

  import favicon from "$lib/assets/favicon.ico";

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
  {@render children()}
</div>

<style>
  .page {
    display: grid;
    grid-template-rows: auto 1fr;

    height: 100%;
    overflow: hidden;
  }
</style>
