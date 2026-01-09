<script lang="ts">
  import "$lib/global.css";

  import favicon from "$lib/assets/favicon.ico";

  const { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
