# @flicmd/bytemd-plugin-math

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-math.svg)](https://npm.im/@flicmd/bytemd-plugin-math)

ByteMD plugin to support math formula

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import math from '@flicmd/bytemd-plugin-math'
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
