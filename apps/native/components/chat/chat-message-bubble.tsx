import type { UIMessage } from "ai"
import { StyleSheet, Text, View } from "react-native"

interface ChatMessageBubbleProps {
  message: UIMessage
}

function getPartBaseKey(messageId: string, part: UIMessage["parts"][number]) {
  switch (part.type) {
    case "text":
      return `${messageId}-text-${part.text}`
    case "reasoning":
      return `${messageId}-reasoning-${part.text}`
    case "tool-getInformation":
      return `${messageId}-tool-${part.state}`
    default:
      return `${messageId}-${part.type}`
  }
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user"
  const keyUsage = new Map<string, number>()

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAssistant]}>
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {message.parts.map((part) => {
          const baseKey = getPartBaseKey(message.id, part)
          const duplicateCount = keyUsage.get(baseKey) ?? 0
          keyUsage.set(baseKey, duplicateCount + 1)
          const key = duplicateCount === 0 ? baseKey : `${baseKey}-${duplicateCount}`

          switch (part.type) {
            case "text":
              return (
                <Text
                  key={key}
                  style={[styles.text, isUser ? styles.textUser : styles.textAssistant]}
                >
                  {part.text}
                </Text>
              )
            case "reasoning":
              return (
                <Text key={key} style={styles.reasoning}>
                  {part.text}
                </Text>
              )
            case "tool-getInformation": {
              const output = part.output as unknown[] | undefined
              return (
                <View key={key} style={styles.toolCard}>
                  <Text style={styles.toolLabel}>
                    {part.state === "output-available"
                      ? `📚 已检索 ${output?.length || 0} 条相关内容`
                      : "🔍 正在搜索知识库..."}
                  </Text>
                </View>
              )
            }
            default:
              return null
          }
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    maxWidth: "80%",
  },
  wrapperUser: {
    alignSelf: "flex-end",
  },
  wrapperAssistant: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
    backgroundColor: "#262626",
  },
  bubbleAssistant: {
    borderBottomLeftRadius: 4,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: "#fff",
  },
  textAssistant: {
    color: "#404040",
  },
  reasoning: {
    fontSize: 12,
    fontStyle: "italic",
    lineHeight: 16,
    color: "#a3a3a3",
  },
  toolCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
  },
  toolLabel: {
    fontSize: 12,
    color: "#737373",
  },
})
