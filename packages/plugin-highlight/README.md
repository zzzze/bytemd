# @flicmd/bytemd-plugin-highlight

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-highlight.svg)](https://npm.im/@flicmd/bytemd-plugin-highlight)

ByteMD plugin to highlight code blocks

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import highlight from '@flicmd/bytemd-plugin-highlight'
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
