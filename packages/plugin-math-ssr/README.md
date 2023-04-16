# @flicmd/bytemd-plugin-math-ssr

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-math-ssr.svg)](https://npm.im/@flicmd/bytemd-plugin-math-ssr)

ByteMD plugin to support math formula (SSR compatible)

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import math from '@flicmd/bytemd-plugin-math-ssr'
import 'katex/dist/katex.css'

new Editor({
  target: document.body,
  props: {
    plugins: [
      math(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
