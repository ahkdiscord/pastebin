<script lang="ts">
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import { versions, type Version } from "$lib/types";
  import { Play, Share } from "@lucide/svelte";

  let script: string = $state("");
  let version: Version = $state("v2.0");

  $effect(() => {
    console.log(script);
  });
</script>

<Page>
  {#snippet headerStart()} 
    <Select>
        AutoHotkey {version}

        {#snippet options()}
          {#each versions as v}
            <Button color="clear" onclick={() => version = v}>use {v}</Button>
          {/each}
        {/snippet}
      </Select>
  {/snippet}

  {#snippet headerEnd()}
    <Button><Share size={16}/> Share</Button>
    <Button><Play size={16}/> Run</Button>
  {/snippet}

  <Editor bind:content={script} />
</Page>