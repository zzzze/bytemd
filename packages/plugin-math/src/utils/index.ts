import { icons } from './icons'
import type { BytemdAction } from 'bytemd'

export type MathLocale = {
  title: string
  inline: string
  inlineText: string
  block: string
  blockText: string
}

export function getMathActions(locale: MathLocale): BytemdAction[] {
  return [
    {
      icon: icons.Formula,
      title: locale.title,
      handler: {
        type: 'dropdown',
        actions: [
          {
            title: locale.inline,
            icon: icons.Inline,
            cheatsheet: `$${locale.inlineText}$`,
            handler: {
              type: 'action',
              click({ wrapText, editor }) {
                wrapText('$')
                editor.focus()
              },
            },
          },
          {
            title: locale.block,
            icon: icons.Block,
            cheatsheet: `$$↵${locale.blockText}↵$$`,
            handler: {
              type: 'action',
              click({ appendBlock, editor, codemirror }) {
                const { line } = appendBlock('$$\n\\TeX\n$$')
                editor.setSelection(
                  codemirror.Pos(line + 1, 0),
                  codemirror.Pos(line + 1, 4)
                )
                editor.focus()
              },
            },
          },
        ],
      },
    },
  ]
}
