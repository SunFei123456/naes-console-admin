import React from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import Icon from '../components/Icon'
import DataTablePro from '../components/DataTablePro'
import UPlotChart from '../components/UPlotChart'
import NivoBar from '../components/NivoBar'
import { ALL_MESSAGES } from '../mocks/messages'
import dayjs from 'dayjs'
import { useThemeStore } from '../stores/theme'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { t } = useTranslation()
  const theme = useThemeStore(s => s.theme)
  const isDark = theme === 'dark'
  const nav = useNavigate()
  // 源数据
  const list = ALL_MESSAGES || []

  // 统计：总数 / 近7天新增 / 最近一条时间 / 公司数
  const total = list.length
  const last7Start = dayjs().startOf('day').subtract(6, 'day')
  const added7d = list.filter(m => dayjs(m.createdAt).isAfter(last7Start)).length
  const latestAt = list.length ? dayjs(list[0].createdAt).format('YYYY-MM-DD') : '-'
  const companyCount = new Set(list.map(m => m.company)).size

  // 趋势：最近30天每日新增（uPlot 数据）
  const days = Array.from({ length: 30 }).map((_, i) => dayjs().startOf('day').subtract(29 - i, 'day'))
  const trend = days.map(d => ({
    date: d.format('MM-DD'),
    ts: d.valueOf(),
    count: list.filter(m => dayjs(m.createdAt).isAfter(d) && dayjs(m.createdAt).isBefore(d.add(1, 'day'))).length,
  }))
  const maxCount = Math.max(1, ...trend.map(x => x.count))
  const uplotData = [trend.map(x => x.ts), trend.map(x => x.count)]

  // Top 5 公司
  const companyMap = list.reduce((acc, cur) => {
    acc[cur.company] = (acc[cur.company] || 0) + 1
    return acc
  }, {})
  const topCompanies = Object.entries(companyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  // 最近10条
  const recent = list.slice(0, 10)
  const columns = [
    { key: 'name', title: 'Name', dataIndex: 'name', width: 140 },
    { key: 'company', title: 'Company', dataIndex: 'company', width: 140 },
    { key: 'email', title: 'Email', dataIndex: 'email', width: 220 },
    { key: 'createdAt', title: 'Created At', dataIndex: 'createdAt', width: 140, render: (v) => dayjs(v).format('YYYY-MM-DD') },
  ]

  // Nivo 数据
  const topBarData = topCompanies.map(([company, count]) => ({ company, count }))

  return (
    <div className="container-page">
      <PageHeader title={t('menu.dashboard')} />

      {/* KPI 区 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-xs text-gray-500 mb-1">Total Messages</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="list" className="w-5 h-5" />
            {total}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-xs text-gray-500 mb-1">New in 7d</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="gauge" className="w-5 h-5" />
            {added7d}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-xs text-gray-500 mb-1">Latest Date</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="globe" className="w-5 h-5" />
            {latestAt}
          </div>
        </div>
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-xs text-gray-500 mb-1">Companies</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            <Icon name="home" className="w-5 h-5" />
            {companyCount}
          </div>
        </div>
      </div>

      {/* 中部：趋势 + Top 公司 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* 趋势（占两列） */}
        <div className="lg:col-span-2 p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="mb-3 text-sm font-medium">New Messages - Last 30 days</div>
          <UPlotChart
            data={uplotData}
            className="w-full"
            style={{ height: 240 }}
            options={{ scales: { x: { time: true } } }}
            isDark={isDark}
            xTickFormatter={(ts) => dayjs(ts).format('MM-DD')}
          />
        </div>

        {/* Top 公司 */}
        <div className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="mb-3 text-sm font-medium">Top Companies</div>
          <NivoBar
            data={topBarData}
            height={240}
            isDark={isDark}
            onBarClick={(d) => {
              const company = d?.data?.company || d?.indexValue || ''
              if (company) nav(`/message?company=${encodeURIComponent(company)}`)
            }}
          />
        </div>
      </div>

      {/* 最近消息表 */}
      <div className="rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-800 text-sm font-medium">Recent Messages</div>
        <div className="p-3">
          <DataTablePro
            columns={columns}
            data={recent}
            rowKey="id"
            density="compact"
            stickyHeader
            enableColumnResizing={false}
          />
        </div>
      </div>
    </div>
  )
}
