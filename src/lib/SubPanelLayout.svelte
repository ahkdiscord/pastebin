<script lang="ts">
  import type { Snippet } from "svelte";
  import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";

  interface Props {
    left: Snippet;
    right: Snippet;
  }

  const { left, right }: Props = $props();

  let dragging: boolean = $state(false);

  let width: number = $state(0);
  let height: number = $state(0);

  function startDrag() {
    document.addEventListener("mouseup", endDrag);
    
    dragging = true;

    width = subpanel.clientWidth;
    height = subpanel.clientHeight;
  }

  function endDrag() {
    dragging = false;
  }

  function drag(e: MouseEvent) {
    if (!dragging) return;

    width -= e.movementX;
    height -= e.movementY;
  }

  let host: HTMLElement;
  let subpanel: HTMLElement;
</script>

<div
  class="panels"
  onmousemove={drag}
  role="none"
  style={`--width: ${width}px; --height: ${height}px`}
  bind:this={host}
>
  <section>
    {@render left()}
  </section>
  <div class="drag-handle" onmousedown={startDrag} role="none">
    <EllipsisVertical size="16" />
  </div>
  <section bind:this={subpanel}>
    {@render right()}
  </section>
</div>

<style>
  .panels {
    height: 100%;

    display: grid;

    grid-template-columns: 1fr auto max(min(var(--width), 50%), 0px);
  }

  .panels > * {
    min-height: 0;
  }

  @media (width < 48rem) {
    .panels {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto max(min(var(--height), 50%), 0px);
    }

    .drag-handle {
      transform: rotateZ(90deg);
    }
  }

  .drag-handle {
    align-self: center;
    justify-self: center;
    cursor: col-resize;
  }
</style>