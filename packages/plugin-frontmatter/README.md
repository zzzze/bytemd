# @flicmd/bytemd-plugin-frontmatter

[![npm](https://img.shields.io/npm/v/@flicmd/bytemd-plugin-frontmatter.svg)](https://npm.im/@flicmd/bytemd-plugin-frontmatter)

ByteMD plugin to parse frontmatter

## Usage

```js
import { Editor } from '@flicmd/bytemd'
import frontmatter from '@flicmd/bytemd-plugin-frontmatter'

new Editor({
  target: document.body,
  props: {
    plugins: [
      frontmatter(),
      // ... other plugins
    ],
  },
})
```

## License

MIT
