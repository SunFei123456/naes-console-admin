import dayjs from 'dayjs'

// 生成虚拟留言数据
const names = ['Alice','Bob','Carol','David','Eve','Frank']
const companies = ['Acme','Contoso','Globex','Initech']

export function genMessages(count = 120) {
  const list = []
  for (let i = 1; i <= count; i++) {
    const name = names[i % names.length]
    const email = `${name.toLowerCase()}@example.com`
    const company = companies[i % companies.length]
    const createdAt = dayjs().subtract(i, 'day').toISOString()
    list.push({
      id: i,
      name,
      email,
      company,
      phone: '123456789',
      whatsapp: '123456789',
      message: `Message content #${i}`,
      createdAt,
      status: i % 3 === 0 ? 'read' : 'unread'
    })
  }
  return list
}

export const ALL_MESSAGES = genMessages()
