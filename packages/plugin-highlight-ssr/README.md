# @flicmd/bytemd-plugin-highlight-ssr

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-highlight-ssr.svg)](https://npm.im/@flicmd/bytemd-plugin-highlight-ssr)

ByteMD plugin to highlight code blocks (SSR compatible)

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import highlight from '@flicmd/bytemd-plugin-highlight-ssr'
import 'highlight.js/styles/default.css'

new Editor({
  target: document.body,
  props: {
    plugins: [
      highlight(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
