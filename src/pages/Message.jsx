import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import DataTablePro from '../components/DataTablePro';
import { SkeletonTable, SkeletonLine } from '../components/Skeleton';
import Icon from '../components/Icon';
import ConfirmDialog from '../components/ConfirmDialog';
import { fetchMessagePage } from '../services/message';
import { loadingBegin, loadingEnd, useLoadingStore } from '../stores/loading';

export default function Message() {
  const { t } = useTranslation()
  const [keyword, setKeyword] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [density, setDensity] = useState('default'); // 'default' | 'compact'
  const [columnVisibility, setColumnVisibility] = useState({});
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const listLoading = useLoadingStore(s => Boolean(s.pendingCount['list']));

  const [detailOpen, setDetailOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const columns = useMemo(() => ([
    { key: 'name', title: t('message.name'), dataIndex: 'name' },
    { key: 'email', title: t('message.email'), dataIndex: 'email' },
    { key: 'createdAt', title: t('message.createdAt'), dataIndex: 'createdAt', render: v => dayjs(v).format('YYYY-MM-DD HH:mm') },
  ]), [t])

  // 初始化列可见性（默认全部可见）
  useEffect(() => {
    const next = {};
    columns.forEach(c => { next[c.key] = true; });
    setColumnVisibility(prev => ({ ...next, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.length])

  const runSearch = async (_page = 1, _pageSize = pageSize, sortField = '', sortOrder = '') => {
    loadingBegin('list');
    const { list, total } = await fetchMessagePage({ 
      page: _page, 
      pageSize: _pageSize, 
      keyword, 
      startAt, 
      endAt,
      sortField,
      sortOrder
    });
    setList(list);
    setTotal(total);
    setPage(_page);
    setPageSize(_pageSize);
    loadingEnd('list', 400);
  };

  // 处理排序变化
  useEffect(() => {
    if (sorting.length > 0) {
      const { id, desc } = sorting[0];
      runSearch(1, pageSize, id, desc ? 'desc' : 'asc');
    } else {
      runSearch(1, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting]);

  // 初次加载
  useEffect(() => {
    runSearch(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onReset = () => {
    setKeyword('')
    setStartAt('')
    setEndAt('')
    runSearch(1, pageSize)
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="container-page h-full flex flex-col min-h-0">
      <PageHeader title={t('message.title')} />

      <div className="mb-4">
        <SearchBar
          keyword={keyword} setKeyword={setKeyword}
          startAt={startAt} setStartAt={setStartAt}
          endAt={endAt} setEndAt={setEndAt}
          onSearch={() => runSearch(1, pageSize)}
          onReset={onReset}
        />
      </div>

      <div className="mb-3 text-sm text-gray-600 dark:text-gray-400">
        {listLoading ? (
          <SkeletonLine width={120} height={14} />
        ) : (
          `Total: ${total}`
        )}
      </div>

      {/* 表格区域：占满剩余空间并在内部滚动 */}
      <div className="flex-1 min-h-0 relative">
        <DataTablePro
          columns={columns}
          data={list}
          rowKey="id"
          loading={listLoading}
          onRowClick={(row) => { setCurrent(row); setDetailOpen(true); }}
          className="h-full border border-gray-200 dark:border-zinc-800 rounded"
          pagination={{
            pageIndex: page - 1,
            pageSize,
            pageCount: Math.ceil(total / pageSize),
          }}
          onPaginationChange={(updater) => {
            const newPagination = typeof updater === 'function' 
              ? updater({ pageIndex: page - 1, pageSize }) 
              : updater;
            runSearch(newPagination.pageIndex + 1, newPagination.pageSize);
          }}
          sorting={sorting}
          onSortingChange={setSorting}
          enableColumnResizing={true}
          stickyHeader={true}
          density={density}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
        />
      </div>

      {/* 底部工具栏：总数 + 分页 + 页大小 + 密度切换 + 列控制 */}
      <div className="mt-3 flex items-center justify-between gap-3">
        {/* 左侧：总数 */}
        <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[120px]">
          {listLoading ? (
            <SkeletonLine width={120} height={14} />
          ) : (
            `Total: ${total}`
          )}
        </div>

        {/* 中间：分页 */}
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-1 disabled:opacity-50" disabled={page <= 1} onClick={() => runSearch(page - 1, pageSize)}>
            <Icon name="chevronLeft" className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <span className="text-sm">{page} / {totalPages}</span>
          <button className="px-2 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-1 disabled:opacity-50" disabled={page >= totalPages} onClick={() => runSearch(page + 1, pageSize)}>
            <span>Next</span>
            <Icon name="chevronRight" className="w-4 h-4" />
          </button>
          <select className="ml-2 px-2 py-1 rounded border dark:border-zinc-700 bg-transparent" value={pageSize} onChange={e => runSearch(1, Number(e.target.value))}>
            {[10,20,50,100].map(sz => <option key={sz} value={sz}>{sz}/page</option>)}
          </select>
        </div>

        {/* 右侧：密度切换 + 列控制 */}
        <div className="relative flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border dark:border-zinc-700 text-sm inline-flex items-center gap-1"
            onClick={() => setDensity(density === 'default' ? 'compact' : 'default')}
            title="Density"
          >
            <Icon name="list" className="w-3.5 h-3.5" />
            <span>{density === 'default' ? 'Density: Default' : 'Density: Compact'}</span>
          </button>
          <button
            className="px-2 py-1 rounded border dark:border-zinc-700 text-sm inline-flex items-center gap-1"
            onClick={() => setShowColumnMenu(v => !v)}
            title="Columns"
          >
            <Icon name="bars" className="w-3.5 h-3.5" />
            <span>Columns</span>
          </button>
          {showColumnMenu && (
            <div className="absolute right-0 top-10 z-20 w-48 rounded border dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow">
              <div className="px-3 py-2 text-xs text-gray-500">Toggle columns</div>
              <div className="max-h-60 overflow-auto py-1">
                {columns.map(c => (
                  <label key={c.key} className="flex items-center gap-2 px-3 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={columnVisibility[c.key] !== false}
                      onChange={e => setColumnVisibility(v => ({ ...v, [c.key]: e.target.checked }))}
                    />
                    <span className="truncate">{c.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 详情弹窗，字段顺序：name+email+submit_at -> others -> message(置底) */}
      <ConfirmDialog
        open={detailOpen}
        title={current ? `${current.name} <${current.email}>` : ''}
        onOk={() => setDetailOpen(false)}
        onCancel={() => setDetailOpen(false)}
        okText={t('common.ok')}
        cancelText={t('common.cancel')}
      >
        {current && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('message.createdAt')}: {dayjs(current.createdAt).format('YYYY-MM-DD HH:mm')}</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>company: {current.company || '-'}</div>
              <div>phone: {current.phone || '-'}</div>
              <div>whatsapp: {current.whatsapp || '-'}</div>
              <div>status: {current.status}</div>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-zinc-800">
              <div className="text-sm font-medium mb-1">message</div>
              <div className="whitespace-pre-wrap break-words text-sm leading-6">{current.message}</div>
            </div>
          </div>
        )}
      </ConfirmDialog>
    </div>
  )
}
