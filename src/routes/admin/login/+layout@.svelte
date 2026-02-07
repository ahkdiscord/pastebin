<script lang="ts">
  const { children } = $props();
</script>

<div class="page">
  {@render children()}
</div>

<style>
  .page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
