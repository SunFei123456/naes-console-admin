import { create } from 'zustand'

// 简单鉴权：仅存储内存 token，并提供登录/登出方法
export const useAuthStore = create((set, get) => ({
  token: null,
  user: null,
  login: async ({ username, password }) => {
    // 这里使用模拟逻辑：任意非空即成功
    if (username && password) {
      const token = 'mock-token'
      set({ token, user: { username } })
      return true
    }
    return false
  },
  logout: () => set({ token: null, user: null }),
  isAuthed: () => Boolean(get().token)
}))
