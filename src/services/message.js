import { ALL_MESSAGES } from '../mocks/messages';
import dayjs from 'dayjs';

// 模拟分页查询 /naes/console/message/page
export async function fetchMessagePage({ 
  page = 1, 
  pageSize = 20, 
  keyword = '', 
  startAt, 
  endAt,
  sortField = 'createdAt',
  sortOrder = 'desc'
} = {}) {
  // 深拷贝模拟数据以避免修改原始数据
  let data = JSON.parse(JSON.stringify(ALL_MESSAGES));

  // 关键词搜索
  if (keyword) {
    const kw = keyword.toLowerCase();
    data = data.filter(x =>
      (x.name || '').toLowerCase().includes(kw) ||
      (x.email || '').toLowerCase().includes(kw) ||
      (x.company || '').toLowerCase().includes(kw) ||
      (x.message || '').toLowerCase().includes(kw)
    );
  }

  // 日期范围筛选
  if (startAt) {
    data = data.filter(x => 
      dayjs(x.createdAt).isAfter(dayjs(startAt).startOf('day')) || 
      dayjs(x.createdAt).isSame(dayjs(startAt), 'day')
    );
  }
  if (endAt) {
    data = data.filter(x => 
      dayjs(x.createdAt).isBefore(dayjs(endAt).endOf('day')) || 
      dayjs(x.createdAt).isSame(dayjs(endAt), 'day')
    );
  }

  // 排序
  data.sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    // 处理可能的空值
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';

    // 日期类型特殊处理
    if (sortField.includes('At') || sortField.includes('date') || sortField.includes('time')) {
      aValue = dayjs(aValue).valueOf();
      bValue = dayjs(bValue).valueOf();
    } else if (typeof aValue === 'string') {
      // 字符串类型不区分大小写比较
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // 排序
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // 分页
  const total = data.length;
  const start = (page - 1) * pageSize;
  const list = data.slice(start, start + pageSize);

  return { list, total, page, pageSize };
}
