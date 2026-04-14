import { defineStore } from 'pinia'
import { ref } from 'vue'
import Dexie from 'dexie'

// 初始化 IndexedDB
const db = new Dexie('LifeIndicatorDB')
db.version(1).stores({
  results: '++id, createdAt, lifeType, score, predictedAge, idealAge'
})

export const useResultStore = defineStore('result', () => {
  const resultData = ref(null)
  const history = ref([])

  function setResult(data) {
    resultData.value = data
  }

  function getResult() {
    return resultData.value
  }

  function clearResult() {
    resultData.value = null
  }

  // 保存到 IndexedDB 历史记录
  async function saveToHistory(result) {
    try {
      await db.results.add({
        ...result,
        createdAt: Date.now()
      })
      await loadHistory()
    } catch (e) {
      console.warn('Failed to save result history:', e)
    }
  }

  // 加载历史记录
  async function loadHistory() {
    try {
      history.value = await db.results.orderBy('createdAt').reverse().toArray()
      // 只保留最近 20 条
      if (history.value.length > 20) {
        const toDelete = history.value.slice(20)
        for (const item of toDelete) {
          await db.results.delete(item.id)
        }
        history.value = history.value.slice(0, 20)
      }
    } catch (e) {
      console.warn('Failed to load history:', e)
    }
  }

  // 删除单条历史
  async function deleteHistoryItem(id) {
    try {
      await db.results.delete(id)
      await loadHistory()
    } catch (e) {
      console.warn('Failed to delete history item:', e)
    }
  }

  // 清空历史
  async function clearHistory() {
    try {
      await db.results.clear()
      history.value = []
    } catch (e) {
      console.warn('Failed to clear history:', e)
    }
  }

  return {
    resultData,
    history,
    setResult,
    getResult,
    clearResult,
    saveToHistory,
    loadHistory,
    deleteHistoryItem,
    clearHistory
  }
})
