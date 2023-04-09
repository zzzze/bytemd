<svelte:options immutable={true} />

<script lang="ts">
  import { BytemdAction } from "./types";

  export let action: BytemdAction
  export let index: number
  export let classNames: string[]
</script>

{#if action.handler && !action.hidden}
  <div
    class={['bytemd-toolbar-icon'].concat(classNames).join(' ')}
    class:bytemd-toolbar-icon-active={action.active}
    bytemd-tippy-path={index}
  >
    {@html action.icon}
  </div>
{/if}
