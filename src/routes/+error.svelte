<script lang="ts">
  import { page } from "$app/state";
</script>

<div>
  <h1>{page.status}</h1>
  <h2>{page.error!.message}</h2>
</div>

<style>
  h1,
  h2 {
    line-height: 1;
    margin: 0;
    text-align: center;
  }
  h1 {
    font-size: 5rem;
  }
  h2 {
    font-size: 1rem;
  }
</style>
