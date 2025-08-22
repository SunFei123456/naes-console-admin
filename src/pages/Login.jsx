import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/auth'

export default function Login() {
  const { t } = useTranslation()
  const nav = useNavigate()
  const login = useAuthStore(s => s.login)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const ok = await login({ username, password })
    setLoading(false)
    if (ok) nav('/dashboard', { replace: true })
    else setError('Invalid credentials')
  }

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      <form onSubmit={onSubmit} className="w-full max-w-sm p-6 rounded border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
        <h1 className="text-2xl font-semibold text-center">{t('login.title')}</h1>
        <label className="block">
          <span className="text-sm mb-1 block">{t('login.username')}</span>
          <input
            className="w-full px-3 py-2 rounded border dark:border-zinc-700 bg-transparent"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="text-sm mb-1 block">{t('login.password')}</span>
          <input
            type="password"
            className="w-full px-3 py-2 rounded border dark:border-zinc-700 bg-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button disabled={loading} className="w-full px-3 py-2 rounded bg-gray-900 text-white dark:bg-gray-100 dark:text-black">
          {t('login.submit')}
        </button>
      </form>
    </div>
  )
}
