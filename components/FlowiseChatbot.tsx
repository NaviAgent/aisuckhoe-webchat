'use client'
import { useEffect, useRef } from 'react'
import type { BubbleProps } from 'flowise-embed'

type Props = BubbleProps & {
    style?: React.CSSProperties
    className?: string
}

type FullPageChatElement = HTMLElement & Props

export const FlowiseChatbot = ({ style, className, ...assignableProps }: Props) => {
    const ref = useRef<FullPageChatElement | null>(null)

    useEffect(() => {
        ; (async () => {
            await import('flowise-embed/dist/web.js')
        })()
    }, [])

    useEffect(() => {
        if (!ref.current) return
        Object.assign(ref.current, assignableProps)
    }, [assignableProps])

    // @ts-expect-error - Ignore type checking for flowise-fullchatbot
    return <flowise-fullchatbot ref={ref} style={style} class={className} />
}