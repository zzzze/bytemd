import type { BytemdPlugin } from '@flicmd/bytemd'
import remarkGemoji from 'remark-gemoji'

export default function gemoji(): BytemdPlugin {
  return {
    remark: (processor) => processor.use(remarkGemoji),
  }
}
