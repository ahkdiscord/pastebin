<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Button from "$lib/Button.svelte";
  import Select from "$lib/Select.svelte";
  import { versions, type Version } from "$lib/types";
  import { Play, Share } from "@lucide/svelte";

  let { children } = $props();

  let version: Version = $state("v2.0");
  let versionSelect: Select;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="page">
  <header>
    <div class="together">
      <Select bind:this={versionSelect}>
        AutoHotkey {version}

        {#snippet options()}
          {#each versions as v}
            <Button color="clear" onclick={() => {
              version = v;
              versionSelect.close();
            }}>use {v}</Button>
          {/each}
        {/snippet}
      </Select>
    </div>
    <div class="together">
      <Button><Share size={16}/> Share</Button>
      <Button><Play size={16}/> Run</Button>
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
    min-height: 100vh;
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5em;

    padding: 0.5em;
  }

  .together {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: inherit;
  }
</style>
