// 分享功能 - 海报生成和链接分享
import html2canvas from 'html2canvas'

/**
 * 生成分享海报图片
 * @param {HTMLElement} element - 要截图的DOM元素
 * @param {string} filename - 文件名
 */
export async function generateSharePoster(element, filename = 'life-expectancy-result.png') {
  if (!element) {
    console.error('Element not found for poster generation')
    return null
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      allowTaint: false,
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight
    })
    
    // 转换为图片并触发下载
    const imageURL = canvas.toDataURL('image/png', 1.0)
    
    // 创建下载链接
    const link = document.createElement('a')
    link.download = filename
    link.href = imageURL
    link.click()
    
    return imageURL
  } catch (error) {
    console.error('Failed to generate poster:', error)
    return null
  }
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
    
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      return true
    } catch (e) {
      return false
    } finally {
      document.body.removeChild(textArea)
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * 生成分享文本
 * @param {Object} resultData - 测试结果数据
 * @returns {string} 分享文本
 */
export function generateShareText(resultData) {
  if (!resultData) return ''
  
  const type = resultData.lifeType
  const typeName = type.name.zh || type.name.en
  const age = resultData.predictedAge
  const potential = resultData.potentialGain
  
  return `🧬 我做了生命长度预测测试！\n` +
         `我的生命类型：${typeName}\n` +
         `⏳ 预期寿命：${age} 岁\n` +
         `💡 改善后可活到：${resultData.idealAge} 岁\n` +
         `▲ 还有 ${potential} 年的提升空间！\n\n` +
         `快来测试你的预期寿命吧 👇\n` +
         `${window.location.origin}`
}

// 简单的本地存储分享（不需要后端）
export function saveSharedResult(resultData) {
  try {
    // 生成一个简单的ID（基于时间戳和随机数）
    const id = 'li_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    
    // 存储到 localStorage
    const sharedResults = JSON.parse(localStorage.getItem('life_indicator_shared') || '{}')
    sharedResults[id] = {
      data: resultData,
      createdAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30天过期
    }
    
    // 清理过期数据
    const now = Date.now()
    for (const key of Object.keys(sharedResults)) {
      if (sharedResults[key].expiresAt < now) {
        delete sharedResults[key]
      }
    }
    
    localStorage.setItem('life_indicator_shared', JSON.stringify(sharedResults))
    
    return `${window.location.origin}/share?id=${id}`
  } catch (error) {
    console.error('Failed to save shared result:', error)
    return null
  }
}

export function loadSharedResult(id) {
  try {
    const sharedResults = JSON.parse(localStorage.getItem('life_indicator_shared') || '{}')
    const result = sharedResults[id]
    
    if (result && result.expiresAt > Date.now()) {
      return result.data
    }
    return null
  } catch (error) {
    console.error('Failed to load shared result:', error)
    return null
  }
}
