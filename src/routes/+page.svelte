<script lang="ts">
  import { enhance } from "$app/forms";
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import { Language } from "$lib/Language.js";
  import Share from "@lucide/svelte/icons/share";
  import Play from "@lucide/svelte/icons/play";
  import Ellipsis from "@lucide/svelte/icons/ellipsis";
  import Output from "$lib/Output.svelte";
  import SubPanelLayout from "$lib/SubPanelLayout.svelte";
  import { isRunnable, runScript } from "$lib/client/running.js";
  import LanguageSelect from "$lib/LanguageSelect.svelte";

  const { data } = $props();

  let script: string = $derived(data.paste ? data.paste.content : (data.script ?? ""));
  let language: Language = $derived(data.paste ? data.paste.language : (data.language ?? "ahkv2.0"));

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
    <form action="?/share" method="POST" use:enhance>
      <input type="hidden" name="language" value={language} />
      <input type="hidden" name="script" value={script} />
      <Button
        onclick={event => {
          if (!script) event.preventDefault();
        }}><Share size={16} /><span class="long">Share</span></Button>
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
      <Editor bind:content={script} {language} />
    {/snippet}

    {#snippet right()}
      <Output content={output} />
    {/snippet}
  </SubPanelLayout>
</Page>

<style>
  @media (width < 32em) {
    .long {
      display: none;
    }
  }

  form {
    display: contents;
  }
</style>
