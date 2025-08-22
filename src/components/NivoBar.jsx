import React from 'react'
import { ResponsiveBar } from '@nivo/bar'

/**
 * Nivo 条形图封装
 * props:
 * - data: [{ company: string, count: number }]
 * - height: number (px)
 * - className: string
 * - theme: Nivo theme (可选，用于 dark 模式)
 */
export default function NivoBar({ data = [], height = 240, className = '', theme }) {
  return (
    <div className={className} style={{ height }}>
      <ResponsiveBar
        data={data}
        keys={["count"]}
        indexBy="company"
        margin={{ top: 16, right: 16, bottom: 28, left: 64 }}
        padding={0.3}
        colors={["#10b981"]}
        theme={theme}
        axisTop={null}
        axisRight={null}
        axisBottom={{ tickSize: 0, tickPadding: 6 }}
        axisLeft={{ tickSize: 0, tickPadding: 6 }}
        enableGridY={true}
        gridYValues={5}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        role="application"
        ariaLabel="Top companies bar chart"
      />
    </div>
  )
}
