<script lang="ts">
  import Editor from "$lib/Editor.svelte";
  import { onMount } from "svelte";

  let script: string = $state("");

  onMount(() => {
    if (!script) {
      script = localStorage.getItem("script") ?? script;
    }
  });

  $effect(() => {
    localStorage.setItem("script", script);
  });
</script>

<Editor bind:content={script} />
