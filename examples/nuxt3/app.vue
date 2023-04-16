<script setup lang="ts">
import { Editor } from '@flicmd/bytemd-vue-next'
import gfm from '@flicmd/bytemd-plugin-gfm'

const content = ref('')
const plugins = [gfm()]
const handleChange = (v: string) => {
  content.value = v
}
</script>

<template>
  <ClientOnly>
    <Editor :value="content" :plugins="plugins" @change="handleChange" />
  </ClientOnly>
</template>
