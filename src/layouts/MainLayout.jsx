import React, { useEffect, useMemo, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../stores/theme'
import { useLangStore } from '../stores/lang'
import { useAuthStore } from '../stores/auth'
import introJs from 'intro.js'
import 'intro.js/minified/introjs.min.css'
import Icon from '../components/Icon'

// 简易布局：左侧侧边栏 + 顶部工具条（主题/语言/登出）+ 面包屑 + 主内容
export default function MainLayout() {
  const { t } = useTranslation()
  const theme = useThemeStore(s => s.theme)
  const toggleTheme = useThemeStore(s => s.toggle)
  const lang = useLangStore(s => s.lang)
  const setLang = useLangStore(s => s.setLang)
  const logout = useAuthStore(s => s.logout)
  const nav = useNavigate()
  const loc = useLocation()

  const crumbs = loc.pathname.split('/').filter(Boolean)

  // 侧边栏收缩状态，持久化到 localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === '1'
  })
  useEffect(() => {
    localStorage.setItem('sidebar_collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  const steps = useMemo(() => ([
    {
      element: '[data-guide="sidebar"]',
      intro: t('menu.dashboard') + ' / ' + t('menu.message')
    },
    {
      element: '[data-guide="theme"]',
      intro: t('header.theme')
    },
    {
      element: '[data-guide="lang"]',
      intro: t('header.language')
    },
    {
      element: '[data-guide="content"]',
      intro: 'Main Content'
    }
  ]), [t])

  const startGuide = () => {
    introJs().setOptions({
      steps,
      showProgress: true,
      showBullets: true,
      exitOnOverlayClick: true
    }).start()
  }

  useEffect(() => {
    // 首次进入触发新手引导
    const key = 'guide_done_v1'
    if (!localStorage.getItem(key)) {
      setTimeout(() => {
        try {
          startGuide()
          localStorage.setItem(key, '1')
        } catch {}
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-zinc-900 text-gray-900 dark:text-gray-100">
      {/* 顶部 Header：左 logo+text，右 操作按钮 */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <Icon name="home" className="w-4 h-4" />
          <span className="font-semibold">{t('app.title')}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* 主题切换 */}
          <button className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2" onClick={toggleTheme} data-guide="theme">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} className="w-4 h-4" />
            {theme === 'dark' ? t('theme.light') : t('theme.dark')}
          </button>
          {/* 语言切换 */}
          <Icon name="globe" className="w-4 h-4 opacity-70" />
          <select
            className="px-2 py-1 rounded border dark:border-zinc-700 bg-transparent"
            value={lang}
            onChange={e => setLang(e.target.value)}
            data-guide="lang"
          >
            <option value="zh">中文</option>
            <option value="en">English</option>
          </select>
          {/* 引导按钮 */}
          <button
            className="px-3 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2"
            onClick={startGuide}
          >
            <Icon name="question" className="w-4 h-4" />
            {t('guide.start')}
          </button>
          {/* 登出 */}
          <button
            className="px-3 py-1 rounded border border-red-300 text-red-600 dark:border-red-700 inline-flex items-center gap-2"
            onClick={() => { logout(); nav('/login', { replace: true }) }}
          >
            <Icon name="logout" className="w-4 h-4" />
            {t('menu.logout')}
          </button>
        </div>
      </header>

      {/* 下方两栏：左侧侧边栏（可收缩）+ 右侧内容区 */}
      <div className="flex-1 flex">
        {/* 侧边栏 */}
        <aside
          className={`${collapsed ? 'w-16' : 'w-56'} transition-all duration-200 ease-in-out shrink-0 border-r border-gray-200 dark:border-zinc-800 p-3 flex flex-col`}
          data-guide="sidebar"
        >
          <nav className="flex flex-col gap-2 flex-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="gauge" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.dashboard')}</span>}
              </span>
            </NavLink>
            <NavLink
              to="/message"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="list" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.message')}</span>}
              </span>
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800 ${isActive ? 'bg-gray-200 dark:bg-zinc-800' : ''}`}
            >
              <span className="inline-flex items-center gap-2">
                <Icon name="user" className="w-4 h-4" />
                {!collapsed && <span>{t('menu.profile')}</span>}
              </span>
            </NavLink>
          </nav>

          {/* 侧边栏底部：收缩/展开开关 */}
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-zinc-800">
            <button
              className="w-full px-2 py-2 rounded border dark:border-zinc-700 inline-flex items-center justify-center gap-2"
              onClick={() => setCollapsed(v => !v)}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              aria-label={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              <Icon name={collapsed ? 'chevronRight' : 'chevronLeft'} className="w-4 h-4" />
              {!collapsed && <span className="text-sm">{collapsed ? t('action.expand') : t('action.collapse')}</span>}
            </button>
          </div>
        </aside>

        {/* 右侧主区域 */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* 面包屑（右内容区域左上角） */}
          <div className="h-10 px-4 flex items-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-zinc-900/60 border border-gray-200 dark:border-zinc-800 rounded px-2 py-1">
              <Icon name="home" className="w-3.5 h-3.5" />
              {crumbs.length === 0 ? (
                <span>home</span>
              ) : (
                crumbs.map((c, i) => (
                  <span key={i} className="inline-flex items-center gap-2">
                    <Icon name="angleRight" className="w-3 h-3 opacity-60" />
                    <span>{c === 'dashboard' ? t('menu.dashboard') : c === 'message' ? t('menu.message') : c === 'profile' ? t('menu.profile') : c}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          {/* 主内容 */}
          <main className="p-4 overflow-y-auto" style={{ height: 'calc(100vh - 56px - 40px)' }} data-guide="content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
