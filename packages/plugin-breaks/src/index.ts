import type { BytemdPlugin } from '@flicmd/bytemd'
import remarkBreaks from 'remark-breaks'

export default function breaks(): BytemdPlugin {
  return {
    remark: (processor) => processor.use(remarkBreaks),
  }
}
