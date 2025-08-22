import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PageHeader from '../components/PageHeader'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'

export default function Profile() {
  const { t } = useTranslation()
  const user = useAuthStore(s => s.user)
  const theme = useThemeStore(s => s.theme)
  const toggleTheme = useThemeStore(s => s.toggle)
  const lang = useLangStore(s => s.lang)
  const setLang = useLangStore(s => s.setLang)

  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.oldPassword) return setError(t('profile.validation.oldRequired'))
    if (!form.newPassword || form.newPassword.length < 6) return setError(t('profile.validation.tooShort'))
    if (form.newPassword !== form.confirmPassword) return setError(t('profile.validation.mismatch'))
    // mock 成功
    setSuccess(t('profile.passwordChanged'))
    setForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
  }

  return (
    <div className="container-page">
      <PageHeader title={t('menu.profile')} />

      {/* 账号信息 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-sm font-medium mb-3">{t('profile.account')}</div>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <div className="mb-2">
              <span className="text-gray-500 dark:text-gray-400 mr-2">{t('profile.username')}:</span>
              <span className="font-medium">{user?.username || '-'}</span>
            </div>
          </div>
        </section>

        {/* 偏好设置 */}
        <section className="p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <div className="text-sm font-medium mb-3">{t('profile.preferences')}</div>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('profile.theme')}</span>
              <button className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2" onClick={toggleTheme}>
                {theme === 'dark' ? t('theme.light') : t('theme.dark')}
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">{t('profile.language')}</span>
              <select className="px-2 py-1 rounded border dark:border-zinc-700 bg-transparent" value={lang} onChange={e => setLang(e.target.value)}>
                <option value="zh">中文</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      {/* 修改密码（Mock） */}
      <section className="mt-4 p-4 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 max-w-2xl">
        <div className="text-sm font-medium mb-3">{t('profile.changePassword')}</div>
        <form onSubmit={onSubmit} className="space-y-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="oldPassword">{t('profile.oldPassword')}</label>
            <input id="oldPassword" type="password" className="sm:col-span-2 px-3 py-2 rounded border dark:border-zinc-700 bg-transparent" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="newPassword">{t('profile.newPassword')}</label>
            <input id="newPassword" type="password" className="sm:col-span-2 px-3 py-2 rounded border dark:border-zinc-700 bg-transparent" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
            <label className="text-gray-600 dark:text-gray-300" htmlFor="confirmPassword">{t('profile.confirmPassword')}</label>
            <input id="confirmPassword" type="password" className="sm:col-span-2 px-3 py-2 rounded border dark:border-zinc-700 bg-transparent" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="pt-2">
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{t('profile.save')}</button>
          </div>
        </form>
      </section>
    </div>
  )
}
