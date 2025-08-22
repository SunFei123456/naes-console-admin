import React, { useCallback, useEffect, useRef, useState } from 'react'
import Icon from './Icon'

/**
 * 自定义语言下拉选择组件
 * - 支持点击外部关闭、Esc 关闭、Enter 确认、上下键移动
 * - 仅用于两个选项：zh / en，但实现为通用结构
 */
export default function LangSelect({ value, onChange, options = [
  { value: 'zh', label: '中文' },
  { value: 'en', label: 'English' },
] }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(() => options.findIndex(o => o.value === value) || 0)
  const rootRef = useRef(null)

  // 点击外部关闭
  useEffect(() => {
    if (!open) return
    const onDocClick = (e) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, options.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const opt = options[activeIndex]
        if (opt) {
          onChange?.(opt.value)
          setOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, options, activeIndex, onChange])

  const current = options.find(o => o.value === value) || options[0]

  const select = useCallback((val) => {
    onChange?.(val)
    setOpen(false)
  }, [onChange])

  return (
    <div ref={rootRef} className="relative" data-guide="lang">
      {/* 触发器 */}
      <button
        type="button"
        className="px-2 py-1 rounded border dark:border-zinc-700 inline-flex items-center gap-2"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Icon name="globe" className="w-4 h-4 opacity-70" />
        <span className="text-sm">{current.label}</span>
        <Icon name="chevronDown" className={`w-3.5 h-3.5 opacity-70 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* 下拉菜单 */}
      {open && (
        <div className="absolute left-0 mt-1 w-[140px] z-20 rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-lg overflow-hidden" role="listbox">
          {options.map((opt, idx) => {
            const active = idx === activeIndex
            const selected = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => select(opt.value)}
                className={`w-full text-left px-3 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-zinc-800' : 'hover:bg-gray-100 dark:hover:bg-zinc-800'} ${selected ? 'font-medium' : ''}`}
                role="option"
                aria-selected={selected}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
