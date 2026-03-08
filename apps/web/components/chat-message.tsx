"use client"

import { getToolName, isToolUIPart, type UIMessage } from "ai"
import type { ReactNode } from "react"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning"
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool"

function renderMessagePart(
  part: UIMessage["parts"][number],
  index: number,
  message: UIMessage,
  isStreaming: boolean
): ReactNode {
  const key = `${message.id}-${index}`

  if (part.type === "reasoning") {
    return (
      <Reasoning isStreaming={isStreaming && index === message.parts.length - 1} key={key}>
        <ReasoningTrigger />
        <ReasoningContent>{part.text}</ReasoningContent>
      </Reasoning>
    )
  }

  if (part.type === "file" && part.mediaType?.startsWith("image/")) {
    return (
      <MessageContent key={key}>
        {/* biome-ignore lint/performance/noImgElement: dynamic AI chat images with unknown dimensions */}
        {/* biome-ignore lint/correctness/useImageSize: dynamic AI chat images with unknown dimensions */}
        <img alt={part.filename ?? "image"} className="max-h-96 rounded-lg" src={part.url} />
      </MessageContent>
    )
  }

  if (isToolUIPart(part)) {
    const toolName = getToolName(part)
    return (
      <Tool key={key}>
        <ToolHeader state={part.state} title={toolName} type={part.type as `tool-${string}`} />
        <ToolContent>
          <ToolInput input={part.input} />
          {(part.state === "output-available" || part.state === "output-error") && (
            <ToolOutput
              errorText={part.state === "output-error" ? part.errorText : undefined}
              output={part.state === "output-available" ? part.output : undefined}
            />
          )}
        </ToolContent>
      </Tool>
    )
  }

  if (part.type !== "text") {
    return null
  }

  if (message.role === "user") {
    return (
      <MessageContent key={key}>
        <p className="whitespace-pre-wrap">{part.text}</p>
      </MessageContent>
    )
  }

  return (
    <MessageContent key={key}>
      <MessageResponse>{part.text}</MessageResponse>
    </MessageContent>
  )
}

export function ChatMessage({
  message,
  isStreaming,
}: {
  message: UIMessage
  isStreaming: boolean
}) {
  return (
    <Message from={message.role}>
      <div>
        {message.parts.map((part, index) => renderMessagePart(part, index, message, isStreaming))}
      </div>
    </Message>
  )
}
