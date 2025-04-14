"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { authApi, getAccessToken, setAccessToken } from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  role: string
  avatar?: string
  rating: number
  balance: number
  created_at: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithOAuth: (provider: "steam" | "discord") => Promise<void>
  refreshToken: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Проверяем наличие токена в URL при загрузке страницы (для OAuth callback)
  useEffect(() => {
    const checkTokenInUrl = () => {
      if (typeof window === "undefined") return

      const params = new URLSearchParams(window.location.search)
      const token = params.get("token")

      if (token) {
        console.log("Обнаружен токен в URL, сохраняем")
        setAccessToken(token)

        // Очищаем URL от параметра token
        const newUrl =
          window.location.pathname +
          (window.location.search ? window.location.search.replace(/[?&]token=[^&]+/, "") : "") +
          window.location.hash
        window.history.replaceState({}, document.title, newUrl)

        // Загружаем данные пользователя
        fetchUserData()
      }
    }

    checkTokenInUrl()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // В браузерной среде localStorage может быть недоступен при серверном рендеринге
        if (typeof window === "undefined") {
          setLoading(false)
          return
        }

        const accessToken = getAccessToken()
        if (!accessToken) {
          setLoading(false)
          return
        }

        await fetchUserData()
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error)
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const fetchUserData = async () => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Ошибка получения данных пользователя:", error)
      // Пробуем обновить токен
      try {
        await refreshToken()
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password)
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя
      const userData = await authApi.getCurrentUser()
      setUser(userData)

      toast({
        title: "Вход выполнен",
        description: `Добро пожаловать, ${userData.username}!`,
      })

      router.push("/")
    } catch (error) {
      console.error("Ошибка входа:", error)
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Произошла ошибка при входе",
      })
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const data = await authApi.register(username, email, password)
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя
      const userData = await authApi.getCurrentUser()
      setUser(userData)

      toast({
        title: "Регистрация успешна",
        description: `Добро пожаловать, ${userData.username}!`,
      })

      router.push("/")
    } catch (error) {
      console.error("Ошибка регистрации:", error)
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error("Ошибка выхода:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      })
      router.push("/")
    }
  }

  const loginWithOAuth = async (provider: "steam" | "discord") => {
    try {
      console.log(`Начинаем OAuth авторизацию через ${provider}`)

      // Получаем URL для авторизации
      const { url } = await authApi.getOAuthUrl(provider)
      console.log(`Получен URL для OAuth: ${url}`)

      // Перенаправляем пользователя на страницу авторизации
      window.location.href = url
    } catch (error) {
      console.error(`Ошибка входа через ${provider}:`, error)
      toast({
        variant: "destructive",
        title: `Ошибка входа через ${provider}`,
        description: error instanceof Error ? error.message : `Произошла ошибка при входе через ${provider}`,
      })
      throw error
    }
  }

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem("refreshToken")

    if (!refreshTokenValue) {
      throw new Error("Нет токена обновления")
    }

    try {
      const data = await authApi.refreshToken(refreshTokenValue)
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя с новым токеном
      const userData = await authApi.getCurrentUser()
      setUser(userData)
      return true
    } catch (error) {
      console.error("Ошибка обновления токена:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loginWithOAuth,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider")
  }
  return context
}
