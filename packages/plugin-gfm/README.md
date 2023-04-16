# @flicmd/bytemd-plugin-gfm

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-gfm.svg)](https://npm.im/@flicmd/bytemd-plugin-gfm)

ByteMD plugin to support GFM (autolink literals, strikethrough, tables, tasklists)

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import gfm from '@flicmd/bytemd-plugin-gfm'

new Editor({
  target: document.body,
  props: {
    plugins: [
      gfm(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
