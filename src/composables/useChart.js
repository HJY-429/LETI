// 图表配置工具
import { DIMENSION_INFO } from '../data/questions.js'

/**
 * 生成雷达图配置
 */
export function getRadarChartConfig(dimensionScores, locale = 'zh') {
  const labels = Object.keys(DIMENSION_INFO).map(key => 
    locale === 'zh' ? DIMENSION_INFO[key].name : key.charAt(0).toUpperCase() + key.slice(1)
  )
  
  const data = Object.keys(DIMENSION_INFO).map(key => dimensionScores[key] || 50)
  
  return {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: locale === 'zh' ? '你的得分' : 'Your Score',
          data,
          backgroundColor: 'rgba(76, 175, 80, 0.2)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(76, 175, 80, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(76, 175, 80, 1)',
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: locale === 'zh' ? '平均水平 (60)' : 'Average (60)',
          data: [60, 60, 60, 60, 60, 60],
          backgroundColor: 'rgba(158, 158, 158, 0.05)',
          borderColor: 'rgba(158, 158, 158, 0.5)',
          borderWidth: 2,
          borderDash: [5, 5],
          pointRadius: 0,
          pointHoverRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            display: false,
            backdropColor: 'transparent'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.06)'
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.06)'
          },
          pointLabels: {
            font: {
              size: 13,
              family: "'Noto Sans SC', sans-serif",
              weight: '500'
            },
            color: '#37474F'
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12, family: "'Noto Sans SC', sans-serif" },
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: 'rgba(38, 50, 56, 0.9)',
          titleFont: { size: 13 },
          bodyFont: { size: 14, weight: 'bold' },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.raw} 分`
            }
          }
        }
      }
    }
  }
}

/**
 * 生成柱状图配置
 */
export function getBarChartConfig(dimensionScores, locale = 'zh') {
  const labels = Object.keys(DIMENSION_INFO).map(key => 
    `${DIMENSION_INFO[key].icon} ${locale === 'zh' ? DIMENSION_INFO[key].name : key.charAt(0).toUpperCase() + key.slice(1)}`
  )
  
  const data = Object.keys(DIMENSION_INFO).map(key => dimensionScores[key] || 50)
  
  // 根据分数设置颜色
  const backgroundColors = Object.keys(DIMENSION_INFO).map(key => {
    const score = dimensionScores[key] || 50
    if (score >= 75) return 'rgba(76, 175, 80, 0.8)'
    if (score >= 55) return 'rgba(255, 152, 0, 0.8)'
    return 'rgba(244, 67, 54, 0.8)'
  })
  
  const borderColors = Object.keys(DIMENSION_INFO).map(key => {
    const score = dimensionScores[key] || 50
    if (score >= 75) return 'rgba(76, 175, 80, 1)'
    if (score >= 55) return 'rgba(255, 152, 0, 1)'
    return 'rgba(244, 67, 54, 1)'
  })

  return {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: locale === 'zh' ? '维度得分' : 'Dimension Score',
        data,
        backgroundColor: backgroundColors,
        borderColors: borderColors,
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            display: false
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.04)',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            font: {
              size: 11,
              family: "'Noto Sans SC', sans-serif"
            },
            color: '#455A64'
          },
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(38, 50, 56, 0.9)',
          titleFont: { size: 13 },
          bodyFont: { size: 18, weight: 'bold' },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return ` ${context.raw} / 100`
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart'
      }
    }
  }
}
