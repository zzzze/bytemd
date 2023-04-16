# @flicmd/bytemd-plugin-mermaid

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-mermaid.svg)](https://npm.im/@flicmd/bytemd-plugin-mermaid)

ByteMD plugin to support Mermaid diagram

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import mermaid from '@flicmd/bytemd-plugin-mermaid'

new Editor({
  target: document.body,
  props: {
    plugins: [
      mermaid(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
