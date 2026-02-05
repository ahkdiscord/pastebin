<script lang="ts">
  import Button from "./Button.svelte";
  import { getDisplayNames, Language } from "./Language";
  import Select from "./Select.svelte";

  interface Props {
    language: Language;
  }

  let { language = $bindable() } = $props();
</script>

<Select>
  {@const names = getDisplayNames(language)}
  <span class="long">{names.long}</span>
  <span class="short">{names.short}</span>

  {#snippet options()}
    {#each Array.of(...Language.values).toSorted() as lang}
      {@const names = getDisplayNames(lang)}
      <Button color="clear" onclick={() => (language = lang)}>
        <span class="long">{names.long}</span>
        <span class="short">{names.short}</span>
      </Button>
    {/each}
  {/snippet}
</Select>

<style>
  .short {
    display: none;
  }

  @media (width < 32em) {
    .long {
      display: none;
    }
    .short {
      display: unset;
    }
  }
</style>
