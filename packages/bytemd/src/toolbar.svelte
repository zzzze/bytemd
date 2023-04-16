<svelte:options immutable={true} />

<script lang="ts">
  import Control from './control.svelte'
  import { getActions } from './editor'
  import { icons } from './icons'
  import type {
    BytemdEditorContext,
    BytemdAction,
    BytemdLocale,
    BytemdActionFactory,
    EditorProps,
  } from './types'
  import type { Editor, KeyMap } from 'codemirror'
  import { createEventDispatcher, onMount, tick } from 'svelte'
  import type { DelegateInstance } from 'tippy.js'
  import { delegate } from 'tippy.js'

  const dispatch = createEventDispatcher()
  let toolbar: HTMLElement

  export let context: BytemdEditorContext
  export let split: boolean
  export let activeTab: false | 'write' | 'preview'
  export let fullscreen: boolean
  export let dark: boolean
  export let sidebar: false | 'help' | 'toc'
  export let locale: BytemdLocale
  export let editor: Editor
  export let plugins: NonNullable<EditorProps['plugins']> = []
  let keyMap: KeyMap = {}

  function isActionFactory(
    action: BytemdAction | BytemdActionFactory
  ): action is BytemdActionFactory {
    return typeof (action as BytemdActionFactory).create === 'function'
  }

  $: actions = getActions(plugins)
  $: _leftActions = [
    ...actions.leftActions.reduce<BytemdAction[]>((actions, action) => {
      if (!isActionFactory(action)) {
        actions.push(action)
      } else {
        actions.push({
          ...action.create({
            dispatch,
            sidebar,
            split,
            activeTab,
            fullscreen,
            dark,
          }),
          position: action.position,
        })
      }
      return actions
    }, []),
  ]

  $: leftActions =
    _leftActions.length === 0
      ? _leftActions
      : _leftActions.concat({
          icon: icons.ApplicationMenu,
          handler: {
            type: 'dropdown',
            actions: _leftActions,
          },
        } as BytemdAction)

  $: rightActions = [
    ...actions.rightActions.reduce<BytemdAction[]>((actions, action) => {
      if (!isActionFactory(action)) {
        actions.push(action)
      } else {
        actions.push({
          ...action.create({
            dispatch,
            sidebar,
            split,
            activeTab,
            fullscreen,
            dark,
          }),
          position: action.position,
        })
      }
      return actions
    }, []),
  ]

  function on() {
    keyMap = {}
    const actions = [...leftActions, ...rightActions]
    while (actions.length) {
      const action = actions.shift()
      if (action?.handler?.type === 'dropdown') {
        actions.unshift(...action.handler.actions)
      } else if (action?.handler?.type === 'action') {
        const { shortcut } = action.handler
        if (shortcut) {
          const { handler } = action
          keyMap[shortcut] = () => {
            handler.click(context)
          }
        }
      }
    }
    editor.addKeyMap(keyMap)
  }
  function off() {
    editor?.removeKeyMap(keyMap) // onDestroy runs at SSR, optional chaining here
  }

  $: if (editor && plugins) {
    off()
    tick().then(() => {
      on()
    })
  }

  const tippyClass = 'bytemd-tippy'
  const tippyClassRight = 'bytemd-tippy-right'
  const tippyPathKey = 'bytemd-tippy-path'

  function getPayloadFromElement(e: Element) {
    const paths = e
      .getAttribute(tippyPathKey)
      ?.split('-')
      ?.map((x) => parseInt(x, 10))
    if (!paths) return
    // if (!paths) {
    //   return {
    //     paths: [],
    //     item: {
    //       title: 'test',
    //       handler: actions,
    //     },
    //   };
    // }

    let item: BytemdAction = {
      title: '',
      handler: {
        type: 'dropdown',
        actions: e.classList.contains(tippyClassRight)
          ? rightActions
          : leftActions,
      },
    }
    paths?.forEach((index) => {
      if (item.handler?.type === 'dropdown') {
        item = item.handler.actions[index]
      }
    })

    return { paths, item: item }
  }

  let delegateInstance: DelegateInstance

  function init() {
    delegateInstance = delegate(toolbar, {
      target: `.${tippyClass}`,
      onCreate({ setProps, reference }) {
        const payload = getPayloadFromElement(reference)
        if (!payload) return
        const { item, paths } = payload
        const { handler } = item
        if (!handler) return

        if (handler.type === 'action') {
          const tooltipContent = document.createElement('div')
          tooltipContent.classList.add('bytemd-tooltip-content')
          tooltipContent.innerHTML = item.title ?? ''
          setProps({
            appendTo: toolbar,
            allowHTML: true,
            theme: 'bytemd-tooltip',
            content: tooltipContent.outerHTML,
            onHidden(ins) {
              ins.destroy()
            },
          })
        } else if (handler.type === 'dropdown') {
          // dropdown
          const dropdown = document.createElement('div')
          dropdown.classList.add('bytemd-dropdown')

          if (item.title) {
            const dropdownTitle = document.createElement('div')
            dropdownTitle.classList.add('bytemd-dropdown-title')
            dropdownTitle.innerHTML = `${
              item.icon
                ? `<div class="bytemd-dropdown-item-icon">${item.icon}</div>`
                : ''
            }<div class="bytemd-dropdown-item-title">${item.title}</div>`
            dropdown.appendChild(dropdownTitle)
          }

          handler.actions.forEach((subAction, i) => {
            const dropdownItem = document.createElement('div')
            dropdownItem.classList.add('bytemd-dropdown-item')
            dropdownItem.setAttribute(tippyPathKey, [...paths, i].join('-'))
            if (subAction.handler?.type === 'dropdown') {
              dropdownItem.classList.add(tippyClass)
            }
            if (reference.classList.contains(tippyClassRight)) {
              dropdownItem.classList.add(tippyClassRight)
            }
            // div.setAttribute('data-tippy-placement', 'right');
            dropdownItem.innerHTML = `${
              subAction.icon
                ? `<div class="bytemd-dropdown-item-icon">${subAction.icon}</div>`
                : ''
            }<div class="bytemd-dropdown-item-title">${subAction.title}</div>${
              subAction.handler?.type === 'dropdown'
                ? `<div class="bytemd-dropdown-item-icon bytemd-dropdown-item-icon-right-arrow">${icons.Right}</div>`
                : ''
            }`
            dropdown.appendChild(dropdownItem)
          })

          setProps({
            appendTo: paths.length > 1 ? 'parent' : toolbar,
            allowHTML: true,
            showOnCreate: true,
            theme: 'bytemd-dropdown-menu',
            placement: paths.length > 1 ? 'right-end' : 'bottom-start',
            interactive: true,
            interactiveDebounce: paths.length > 1 ? 0 : 50,
            arrow: true,
            offset: [0, 4],
            content: dropdown.outerHTML,
            onHidden(ins) {
              ins.destroy()
            },
            onCreate(ins) {
              ;[
                ...ins.popper.querySelectorAll('.bytemd-dropdown-item'),
              ].forEach((el, i) => {
                const actionHandler = handler.actions[i]?.handler
                if (actionHandler?.type === 'action') {
                  const { mouseenter, mouseleave } = actionHandler
                  if (mouseenter) {
                    el.addEventListener('mouseenter', () => {
                      mouseenter(context)
                    })
                  }
                  if (mouseleave) {
                    el.addEventListener('mouseleave', () => {
                      mouseleave(context)
                    })
                  }
                }
              })
            },
          })
        }
      },
    })
  }

  onMount(() => {
    init()
  })

  function handleClick(e: MouseEvent | KeyboardEvent) {
    const target = (e.target as Element).closest(`[${tippyPathKey}]`)
    if (!target) return
    const handler = getPayloadFromElement(target)?.item?.handler
    if (handler?.type === 'action') {
      handler.click(context)
    }
    delegateInstance?.destroy()
    init()
  }
</script>

<div
  class="bytemd-toolbar"
  bind:this={toolbar}
  on:click={handleClick}
  on:keydown|self={(e) => ['Enter', 'Space'].includes(e.code) && handleClick(e)}
>
  <div class="bytemd-toolbar-left">
    {#if split}
      {#each leftActions as item, index}
        {#if index < leftActions.length - 1}
          <Control action={item} {index} classNames={[tippyClass]} />
        {/if}
      {/each}
    {:else}
      <div
        on:click={() => dispatch('tab', 'write')}
        on:keydown|self={(e) =>
          ['Enter', 'Space'].includes(e.code) && dispatch('tab', 'write')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab !== 'preview'}
      >
        {locale.write}
      </div>
      <div
        on:click={() => dispatch('tab', 'preview')}
        on:keydown|self={(e) =>
          ['Enter', 'Space'].includes(e.code) && dispatch('tab', 'preview')}
        class="bytemd-toolbar-tab"
        class:bytemd-toolbar-tab-active={activeTab === 'preview'}
      >
        {locale.preview}
      </div>
      {#if leftActions.length}
        <Control
          action={leftActions[leftActions.length - 1]}
          index={leftActions.length - 1}
          classNames={[tippyClass]}
        />
      {/if}
    {/if}
  </div>

  <div class="bytemd-toolbar-right">
    {#each rightActions as item, index}
      <Control
        action={item}
        {index}
        classNames={[tippyClass, tippyClassRight]}
      />
    {/each}
  </div>
</div>
