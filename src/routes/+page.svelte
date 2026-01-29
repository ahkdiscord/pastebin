<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import { versions, type Version } from "$lib/types";
  import Share from "@lucide/svelte/icons/share";
  import Play from "@lucide/svelte/icons/play";

  const { data } = $props();

  let script: string = $derived(data.paste?.content ?? "");
  let version: Version = $derived(data.paste?.version ?? "v2.0");

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
    <form action="?/share" method="POST" use:enhance>
      <input type="hidden" name="version" value={version} />
      <input type="hidden" name="script" value={script} />
      <Button><Share size={16}/> Share</Button>
    </form>
    <Button><Play size={16}/> Run</Button>
  {/snippet}

  <Editor bind:content={script} />
</Page>