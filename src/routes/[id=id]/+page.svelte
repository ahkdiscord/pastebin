<script lang="ts">
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import Pen from "@lucide/svelte/icons/pen";
  import Play from "@lucide/svelte/icons/play";
  import Check from "@lucide/svelte/icons/check";
  import { enhance } from "$app/forms";
    import type { Result } from "$lib/server/running.js";
    import SubPanelLayout from "$lib/SubPanelLayout.svelte";
    import Output from "$lib/Output.svelte";

  const { data } = $props();

  const { content: script, version } = $derived(data.paste);

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
  }
</script>

<Page>
  {#snippet headerStart()} 
    <Select disabled>
      AutoHotkey {version}
    </Select>
  {/snippet}

  {#snippet headerEnd()}
    <form action="?/edit" method="POST" use:enhance>
      <Button ><Pen size={16}/> Edit</Button>
    </form>
    <Button onclick={() => {
      if (!script) return;
      runScript();
    }}><Play size={16}/> Run</Button>
  {/snippet}

  <SubPanelLayout>
    {#snippet left()}
    <Editor readOnly content={script} />
    {/snippet}
    
    {#snippet right()}
      <Output content={output} />
    {/snippet}
  </SubPanelLayout>
</Page>

{#if data.newlyPasted}
  <div class="toast">
    <div class="content">
      <Check size={16} /> Your script has been saved
    </div>
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    top: 1em;
    left: 0;
    right: 0;

    display: flex;
    justify-content: center;

    z-index: 20;
    pointer-events: none;
    user-select: none;

    opacity: 0;
    animation: 500ms forwards fly-in, 500ms 5s reverse fly-in;
    animation-fill-mode: forwards;
  }

  .toast .content {
    background-color: var(--slate);
    padding: 1em 1.5em;
    border-radius: 1em;

    display: flex;
    align-items: center;
    gap: 0.5em;
  }

  @keyframes fly-in {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }

    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
</style>