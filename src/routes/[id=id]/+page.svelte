<script lang="ts">
  import Button from "$lib/Button.svelte";
  import Editor from "$lib/Editor.svelte";
  import Page from "$lib/Page.svelte";
  import Select from "$lib/Select.svelte";
  import Pen from "@lucide/svelte/icons/pen";
  import Play from "@lucide/svelte/icons/play";
  import Link from "$lib/Link.svelte";

  const { data } = $props();

  const { id, content: script, version } = $derived(data.paste);
</script>

<Page>
  {#snippet headerStart()} 
    <Select disabled>
      AutoHotkey {version}
    </Select>

    {#if data.newlyPasted}
      NEWLY PASTED
    {/if}
  {/snippet}

  {#snippet headerEnd()}
    <Link href={`/${id}/edit`}><Pen size={16}/> Edit</Link>
    <Button><Play size={16}/> Run</Button>
  {/snippet}

  <Editor readOnly content={script} />
</Page>