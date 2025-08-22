import React, { useEffect, useRef } from 'react'
import uPlot from 'uplot'
import 'uplot/dist/uPlot.min.css'

/**
 * uPlot 趋势图组件（极简封装）
 * props:
 * - data: [x[], y[]] 其中 x 为时间戳(ms)，y 为数值
 * - className / style: 容器样式
 * - options: 额外 uPlot 选项覆盖
 */
export default function UPlotChart({ data, className = '', style, options }) {
  const ref = useRef(null)
  const chart = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const base = {
      width: ref.current.clientWidth || 600,
      height: (style && style.height) ? parseInt(style.height, 10) : 220,
      padding: [8, 8, 24, 32],
      series: [
        {},
        {
          label: 'Value',
          width: 2,
          stroke: '#3b82f6',
          fill: 'rgba(59,130,246,0.12)',
        },
      ],
      axes: [
        {
          stroke: '#9CA3AF',
          grid: { stroke: 'rgba(0,0,0,0.06)' },
        },
        {
          stroke: '#9CA3AF',
          grid: { stroke: 'rgba(0,0,0,0.06)' },
        },
      ],
    }
    chart.current = new uPlot({ ...base, ...options }, data, ref.current)

    const onResize = () => {
      if (!ref.current || !chart.current) return
      chart.current.setSize({ width: ref.current.clientWidth, height: base.height })
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (chart.current) {
        chart.current.destroy()
        chart.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (chart.current && data) {
      chart.current.setData(data)
    }
  }, [data])

  return <div ref={ref} className={className} style={style} />
}
