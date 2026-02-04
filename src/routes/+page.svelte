<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import { Version } from "$lib/types";
  import Share from "@lucide/svelte/icons/share";
  import Play from "@lucide/svelte/icons/play";
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import Output from "$lib/Output.svelte";
  import type { Result } from "$lib/server/running.js";
  import SubPanelLayout from "$lib/SubPanelLayout.svelte";

  const { data } = $props();

  let script: string = $derived(data.paste?.content ?? "");
  let version: Version | undefined = $derived(data.paste ? data.paste.version : "v2.0");

  let running: boolean = $state(false);
  let output: string = $state("");

  async function runScript() {
    if (!version) return;

    running = true;

    try {
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
    } finally {
      running = false;
    }
  }

  let panels: SubPanelLayout;
</script>

<Page>
  {#snippet headerStart()}
    <Select>
      {#if version}
        <span class="unimportant">AutoHotkey</span>
        {version}
      {:else}
        Plain Text
      {/if}

      {#snippet options()}
        {#each Array.of(...Version.values).toSorted() as v}
          <Button color="clear" onclick={() => (version = v)}><span class="unimportant">use</span> {v}</Button>
        {/each}
        <Button color="clear" onclick={() => (version = undefined)}>Plain Text</Button>
      {/snippet}
    </Select>
  {/snippet}

  {#snippet headerEnd()}
    <form action="?/share" method="POST" use:enhance>
      <input type="hidden" name="version" value={version} />
      <input type="hidden" name="script" value={script} />
      <Button
        onclick={event => {
          if (!script) event.preventDefault();
        }}><Share size={16} /> Share</Button>
    </form>

    {#if running}
      <Button disabled>
        <Ellipsis size={16} /> Running
      </Button>
    {:else}
      <Button
        disabled={!version}
        onclick={() => {
          if (!script) return;
          runScript();
        }}>
        <Play size={16} /> Run
      </Button>
    {/if}
  {/snippet}

  <SubPanelLayout bind:this={panels}>
    {#snippet left()}
      <Editor bind:content={script} {version} />
    {/snippet}

    {#snippet right()}
      <Output content={output} />
    {/snippet}
  </SubPanelLayout>
</Page>

<style>
  @media (width < 32em) {
    .unimportant {
      display: none;
    }
  }

  form {
    display: contents;
  }
</style>
