<script lang="ts">
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Pen from "@lucide/svelte/icons/pen";
  import Play from "@lucide/svelte/icons/play";
  import Check from "@lucide/svelte/icons/check";
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import { enhance } from "$app/forms";
  import SubPanelLayout from "$lib/SubPanelLayout.svelte";
  import Output from "$lib/Output.svelte";
  import { isRunnable, runScript } from "$lib/client/running.js";
  import LanguageSelect from "$lib/LanguageSelect.svelte";

  const { data } = $props();

  let { content: script, language } = $derived(data.paste);

  let running: boolean = $state(false);
  let output: string = $state("");

  async function run() {
    if (!isRunnable(language)) return;

    running = true;
    try {
      output = await runScript(script, language);
      panels.open();
    } catch (e) {
      output = `Sorry, an error occurred:\n${e}`;
    } finally {
      running = false;
    }
  }

  let panels: SubPanelLayout;
</script>

<Page>
  {#snippet headerStart()}
    <LanguageSelect bind:language />
  {/snippet}

  {#snippet headerEnd()}
    <form action="?/edit" method="POST" use:enhance>
      <Button><Pen size={16} /><span class="long">Edit</span></Button>
    </form>

    {#if running}
      <Button disabled>
        <Ellipsis size={16} /><span class="long">Running</span>
      </Button>
    {:else}
      <Button
        disabled={!isRunnable(language)}
        onclick={() => {
          if (!script) return;
          run();
        }}>
        <Play size={16} /><span class="long">Run</span>
      </Button>
    {/if}
  {/snippet}

  <SubPanelLayout bind:this={panels}>
    {#snippet left()}
      <Editor readOnly content={script} {language} />
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
  @media (width < 32em) {
    .long {
      display: none;
    }
  }

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
    animation:
      500ms forwards fly-in,
      500ms 5s reverse fly-in;
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
