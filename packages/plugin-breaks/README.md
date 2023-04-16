# @flicmd/bytemd-plugin-breaks

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-breaks.svg)](https://npm.im/@flicmd/bytemd-plugin-breaks)

ByteMD plugin to support breaks

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import breaks from '@flicmd/bytemd-plugin-breaks'

new Editor({
  target: document.body,
  props: {
    plugins: [
      breaks(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
