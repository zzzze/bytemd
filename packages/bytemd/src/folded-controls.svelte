<svelte:options immutable={true} />

<script lang="ts">
import { icons } from "./icons";

  import { BytemdAction } from "./types";

  export let actions: BytemdAction[]

  const action = {
    icon: icons.H,
    handler: {
      type: 'dropdown',
      actions,
    }
  }
</script>
