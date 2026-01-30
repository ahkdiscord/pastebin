<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import { versions, type Version } from "$lib/types";
  import Share from "@lucide/svelte/icons/share";
  import Play from "@lucide/svelte/icons/play";
  import Output from "$lib/Output.svelte";
  import type { Result } from "$lib/server/running.js";
  import SubPanelLayout from "$lib/SubPanelLayout.svelte";

  const { data } = $props();

  let script: string = $derived(data.paste?.content ?? "");
  let version: Version = $derived(data.paste?.version ?? "v2.0");

  let output: string = $state("");

  async function runScript() {
    const response = await fetch("/run", {
      method: "POST",
      body: JSON.stringify({ version, script }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: Result = await response.json();

    output = result.output;
    panels.open();
  }

  let panels: SubPanelLayout;
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
      <Button onclick={event => {
        if (!script) event.preventDefault();
      }}><Share size={16}/> Share</Button>
    </form>
    <Button onclick={() => {
      if (!script) return;
      runScript();
    }}><Play size={16}/> Run</Button>
  {/snippet}
    
  <SubPanelLayout bind:this={panels}>
    {#snippet left()}
    <Editor bind:content={script} />
    {/snippet}
    
    {#snippet right()}
      <Output content={output} />
    {/snippet}
  </SubPanelLayout>
</Page>

<style>
  form {
    display: contents;
  }
</style>