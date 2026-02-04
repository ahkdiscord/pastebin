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

  export function open() {
    if (width < 100) host.style.setProperty("--width", "auto");
    if (height < 100) host.style.setProperty("--height", "auto");

    width = subpanel.clientWidth;
    height = subpanel.clientHeight;

    host.style.setProperty("--width", `${width}px`);
    host.style.setProperty("--height", `${height}px`);
  }

  function startDrag() {
    dragging = true;

    width = subpanel.clientWidth;
    height = subpanel.clientHeight;
  }

  function endDrag() {
    dragging = false;

    previousTouch = undefined;
  }

  function mouseDrag(e: MouseEvent) {
    if (!dragging) return;

    width -= e.movementX;
    height -= e.movementY;
  }

  let previousTouch: Touch | undefined;
  function touchDrag(e: TouchEvent) {
    if (!dragging) return;

    width -= previousTouch ? e.touches[0].pageX - previousTouch.pageX : 0;
    height -= previousTouch ? e.touches[0].pageY - previousTouch.pageY : 0;

    previousTouch = e.changedTouches[0];
  }

  let host: HTMLElement;
  let subpanel: HTMLElement;
</script>

<svelte:body onmouseup={endDrag} ontouchend={endDrag} />

<div
  class="panels"
  onmousemove={mouseDrag}
  ontouchmove={touchDrag}
  role="none"
  style={`--width: ${width}px; --height: ${height}px`}
  bind:this={host}>
  <section>
    {@render left()}
  </section>
  <div class="drag-handle" onmousedown={startDrag} ontouchstart={startDrag} role="button" tabindex="-1">
    <EllipsisVertical size="16" />
  </div>
  <section bind:this={subpanel}>
    {@render right()}
  </section>
</div>

<style>
  .panels {
    width: 100%;
    height: 100%;

    display: grid;

    grid-template-columns: 1fr auto max(min(var(--width), 50%), 0px);
  }

  .panels > * {
    min-height: 0;
    min-width: 0;
  }

  .drag-handle {
    align-self: center;
    justify-self: center;
    cursor: col-resize;
    display: flex;
  }

  @media (width < 48rem) {
    .panels {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr auto max(min(var(--height), 50%), 0px);
    }

    .drag-handle {
      transform: rotateZ(90deg);
      padding: 0.5em;
    }
  }

  @media (pointer: fine) {
    .drag-handle {
      padding: 0;
    }
  }
</style>
