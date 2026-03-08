import { StyleSheet, Text, View } from "react-native"

interface FolderRankingListProps {
  data: Array<{ name: string; emoji: string; count: number }>
}

export function FolderRankingList({ data }: FolderRankingListProps) {
  const maxCount = Math.max(...data.map((item) => item.count), 1)
  const keyUsage = new Map<string, number>()

  if (data.length === 0) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>文件夹排行</Text>
        <Text style={styles.empty}>暂无数据</Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>文件夹排行</Text>
      <View style={styles.list}>
        {data.slice(0, 5).map((item, index) => {
          const baseKey = `${item.name}-${item.emoji}-${item.count}`
          const duplicateCount = keyUsage.get(baseKey) ?? 0
          keyUsage.set(baseKey, duplicateCount + 1)
          const key = duplicateCount === 0 ? baseKey : `${baseKey}-${duplicateCount}`

          return (
            <View key={key} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.rank}>{index + 1}</Text>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text numberOfLines={1} style={styles.name}>
                  {item.name}
                </Text>
                <Text style={styles.count}>{item.count}</Text>
              </View>
              <View style={styles.progressBg}>
                <View
                  style={[styles.progressFill, { width: `${(item.count / maxCount) * 100}%` }]}
                />
              </View>
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: "#a3a3a3",
    textAlign: "center",
    paddingVertical: 20,
  },
  list: {
    gap: 14,
  },
  item: {
    gap: 8,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rank: {
    width: 20,
    fontSize: 14,
    fontWeight: "600",
    color: "#a3a3a3",
  },
  emoji: {
    fontSize: 16,
  },
  name: {
    flex: 1,
    fontSize: 14,
    color: "#404040",
  },
  count: {
    fontSize: 14,
    fontWeight: "500",
    color: "#737373",
  },
  progressBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f5f5f5",
    marginLeft: 28,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: "#3b82f6",
  },
})
