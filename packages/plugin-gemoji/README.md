# @flicmd/bytemd-plugin-gemoji

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-gemoji.svg)](https://npm.im/@flicmd/bytemd-plugin-gemoji)

ByteMD plugin to support Gemoji shortcodes

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import gemoji from '@flicmd/bytemd-plugin-gemoji'

new Editor({
  target: document.body,
  props: {
    plugins: [
      gemoji(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
