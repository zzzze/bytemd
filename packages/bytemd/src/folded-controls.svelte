<svelte:options immutable={true} />

<script lang="ts">
  import { icons } from './icons'
  import { BytemdAction } from './types'
  import { onMount } from 'svelte'

  export let actions: BytemdAction[]

  const action = {
    icon: icons.H,
    handler: {
      type: 'dropdown',
      actions,
    },
  }

  function init() {}

  onMount(() => {
    init()
  })
</script>
