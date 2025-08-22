import React from 'react'
import Icon from './Icon'
import { useTranslation } from 'react-i18next'

// 简易搜索条：关键字与时间范围（起止），供 Message 页面使用
export default function SearchBar({ keyword, setKeyword, startAt, setStartAt, endAt, setEndAt, onSearch, onReset }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap items-end gap-3 p-3 border rounded border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
      <label className="flex flex-col text-sm">
        <span className="mb-1">{t('search.keyword')}</span>
        <input className="px-2 py-1 rounded border dark:border-zinc-700 bg-transparent" value={keyword} onChange={e => setKeyword(e.target.value)} />
      </label>
      <label className="flex flex-col text-sm">
        <span className="mb-1">{t('search.timeRange')}</span>
        <div className="flex gap-2">
          <input type="date" className="px-2 py-1 rounded border dark:border-zinc-700 bg-transparent" value={startAt} onChange={e => setStartAt(e.target.value)} />
          <input type="date" className="px-2 py-1 rounded border dark:border-zinc-700 bg-transparent" value={endAt} onChange={e => setEndAt(e.target.value)} />
        </div>
      </label>
      <div className="ml-auto flex gap-2">
        <button className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2" onClick={onSearch}>
          <Icon name="search" className="w-4 h-4" />
          {t('common.search')}
        </button>
        <button className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2" onClick={onReset}>
          <Icon name="close" className="w-4 h-4" />
          {t('common.reset')}
        </button>
      </div>
    </div>
  )
}
