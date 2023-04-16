<script lang="ts">
  import markdownText from './text.md?raw'
  import { Editor, builtInPlugins } from '@flicmd/bytemd'
  import type { BytemdEditorAPI } from '@flicmd/bytemd'
  import breaks from '@flicmd/bytemd-plugin-breaks'
  import frontmatter from '@flicmd/bytemd-plugin-frontmatter'
  import gemoji from '@flicmd/bytemd-plugin-gemoji'
  import gfm from '@flicmd/bytemd-plugin-gfm'
  import highlight from '@flicmd/bytemd-plugin-highlight'
  import math from '@flicmd/bytemd-plugin-math'
  import mediumZoom from '@flicmd/bytemd-plugin-medium-zoom'
  import mermaid from '@flicmd/bytemd-plugin-mermaid'
  import '@flicmd/bytemd/dist/index.css'
  import '@flicmd/bytemd/dist/theme/abcdef.css'
  import '@flicmd/bytemd/dist/theme/blackboard.css'
  import '@flicmd/bytemd/dist/theme/moxer.css'
  import '@flicmd/bytemd/dist/theme/nord.css'
  import '@flicmd/bytemd/dist/theme/tomorrow-night-eighties.css'
  import 'highlight.js/styles/vs.css'
  // placed after highlight styles to override `code` padding
  import 'katex/dist/katex.css'
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ ready: BytemdEditorAPI }>()

  function stripPrefixes(obj: Record<string, any>) {
    return Object.entries(obj).reduce((p, [key, value]) => {
      p[key.split('/').slice(-1)[0].replace('.json', '')] = value
      // console.log(p)
      return p
    }, {} as Record<string, any>)
  }

  let dark = false
  const useDark = window.matchMedia('(prefers-color-scheme: dark)')
  function toggleDarkMode(state: boolean) {
    dark = state
  }
  toggleDarkMode(localStorage.getItem('dark-mode') == 'true')
  useDark.addListener((evt) => toggleDarkMode(evt.matches))

  const locales = stripPrefixes(
    import.meta.glob('/node_modules/bytemd/locales/*.json', { eager: true })
  )
  const gfmLocales = stripPrefixes(
    import.meta.glob('/node_modules/@flicmd/bytemd-plugin-gfm/locales/*.json', {
      eager: true,
    })
  )
  const mathLocales = stripPrefixes(
    import.meta.glob(
      '/node_modules/@flicmd/bytemd-plugin-math/locales/*.json',
      {
        eager: true,
      }
    )
  )
  const mermaidLocales = stripPrefixes(
    import.meta.glob(
      '/node_modules/@flicmd/bytemd-plugin-mermaid/locales/*.json',
      {
        eager: true,
      }
    )
  )

  let value = markdownText
  let mode = 'auto'
  let darkTheme = 'nord'
  let localeKey = 'en'
  let maxLength: number
  let darkThemes = [
    'nord',
    'abcdef',
    'blackboard',
    'moxer',
    'tomorrow-night-eighties',
  ]

  let enabled = {
    breaks: false,
    frontmatter: true,
    gemoji: true,
    gfm: true,
    highlight: true,
    math: true,
    'medium-zoom': true,
    mermaid: true,
  }

  $: plugins = [
    builtInPlugins.head(),
    builtInPlugins.bold(),
    builtInPlugins.italic(),
    builtInPlugins.quote(),
    builtInPlugins.link(),
    builtInPlugins.code(),
    builtInPlugins.codeBlock(),
    builtInPlugins.ul(),
    builtInPlugins.ol(),
    builtInPlugins.hr({ position: 'right' }),

    enabled.breaks && breaks(),
    enabled.frontmatter && frontmatter(),
    enabled.gemoji && gemoji(),
    enabled.gfm &&
      gfm({
        locale: gfmLocales[localeKey],
      }),
    enabled.highlight && highlight(),
    enabled.math &&
      math({
        locale: mathLocales[localeKey],
        katexOptions: { output: 'html' }, // https://github.com/KaTeX/KaTeX/issues/2796
      }),
    enabled['medium-zoom'] && mediumZoom(),
    enabled.mermaid &&
      mermaid({
        locale: mermaidLocales[localeKey],
      }),

    builtInPlugins.source(),
    builtInPlugins.fullscreen(),
    builtInPlugins.darkMode(),
    builtInPlugins.preview(),
    builtInPlugins.write(),
    builtInPlugins.help(),
    builtInPlugins.toc(),
  ].filter((x) => x)
</script>

<div class="container">
  {#if dark}
    <link
      rel="stylesheet"
      href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-dark.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css"
    />
  {:else}
    <link
      rel="stylesheet"
      href="https://cdn.bootcdn.net/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.bootcdn.net/ajax/libs/highlight.js/11.7.0/styles/vs.min.css"
    />
  {/if}

  <div class="line">
    Mode:
    {#each ['auto', 'split', 'tab'] as m}
      <label> <input type="radio" bind:group={mode} value={m} />{m}</label>
    {/each}
    , Dark theme:
    <select bind:value={darkTheme}>
      {#each darkThemes as t}
        <option value={t}>{t}</option>
      {/each}
    </select>
    , Locale:
    <select bind:value={localeKey}>
      {#each Object.keys(locales) as l}
        <option value={l}>{l}</option>
      {/each}
    </select>
    , Max length:
    <input bind:value={maxLength} type="number" />
  </div>
  <div class="line">
    Plugins:
    {#each Object.keys(enabled) as p}
      {' '}
      <label> <input type="checkbox" bind:checked={enabled[p]} />{p}</label>
    {/each}
  </div>

  <Editor
    {value}
    {mode}
    {plugins}
    {maxLength}
    {darkTheme}
    {dark}
    placeholder={'Start writing with ByteMD'}
    locale={locales[localeKey]}
    uploadImages={(files) => {
      return Promise.all(
        files.map((file) => {
          // TODO:
          return {
            url: 'https://picsum.photos/300',
          }
        })
      )
    }}
    on:change={(e) => {
      value = e.detail.value
    }}
    on:darkmodechange={(e) => {
      toggleDarkMode(e.detail.value)
    }}
  />
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  .line {
    margin: 10px 0;
    text-align: center;
  }
  :global(body) {
    margin: 0 10px;
    font-size: 14px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
      sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  }
  :global(.bytemd) {
    height: calc(100vh - 100px);
  }
  :global(.medium-zoom-overlay) {
    z-index: 100;
  }
  :global(.medium-zoom-image--opened) {
    z-index: 101;
  }
</style>
