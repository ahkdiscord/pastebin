<script lang="ts">
  import { invalidateAll } from "$app/navigation";
  import Button from "$lib/Button.svelte";
  import { getDisplayNames } from "$lib/Language";
  import Link from "$lib/Link.svelte";
  import { ExternalLink, Trash } from "@lucide/svelte";
  import { format } from "date-fns";

  const { data } = $props();

  async function deletePaste(pasteId: number) {
    const response = await fetch(`/api/v1/${pasteId}`, { method: "DELETE" });

    if (response.ok) await invalidateAll();
  }
</script>

<div class="wrapper">
  {#each data.pastes as paste}
    <article>
      <Link href={`/${paste.id}`}>
        {paste.id}
        <ExternalLink size={16} />
      </Link>
      <span>{getDisplayNames(paste.language).long}</span>
      <span>{format(paste.creation, "yyyy-MM-dd HH:mm:ss")}</span>
      <span>{format(paste.expiry, "yyyy-MM-dd HH:mm:ss")}</span>
      <Button color="coral" onclick={() => deletePaste(paste.id)}><Trash size={16} color="var(--coral)" /></Button>
    </article>
  {/each}
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-columns: auto repeat(3, 1fr) auto;
    gap: 0.5em;
  }

  article {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: subgrid;
    justify-items: center;
    align-items: center;

    border-radius: 0.5em;
    border: 2px solid var(--slate);
    background-color: var(--night);

    padding: 1em;
  }
</style>
