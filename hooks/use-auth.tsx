"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) {
          setLoading(false)
          return
        }

        const response = await fetch("/api/v1/users/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          // Пробуем обновить токен
          try {
            await refreshToken()
          } catch (error) {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
          }
        }
      } catch (error) {
        console.error("Ошибка проверки аутентификации:", error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.message || "Ошибка входа")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя
      const userResponse = await fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Ошибка входа:", error)
      throw error
    }
  }

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail?.message || "Ошибка регистрации")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя
      const userResponse = await fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      }
    } catch (error) {
      console.error("Ошибка регистрации:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (accessToken) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      }
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
      const response = await fetch(`/api/v1/auth/oauth/${provider}`)
      if (response.ok) {
        const data = await response.json()
        window.location.href = data.url
      } else {
        throw new Error(`Не удалось начать вход через ${provider}`)
      }
    } catch (error) {
      console.error(`Ошибка входа через ${provider}:`, error)
      throw error
    }
  }

  const refreshToken = async () => {
    const refreshTokenValue = localStorage.getItem("refreshToken")
    const accessTokenValue = localStorage.getItem("accessToken")

    if (!refreshTokenValue) {
      throw new Error("Нет токена обновления")
    }

    try {
      const response = await fetch("/api/v1/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshTokenValue,
          access_token: accessTokenValue,
        }),
      })

      if (!response.ok) {
        throw new Error("Не удалось обновить токен")
      }

      const data = await response.json()
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)

      // Получаем данные пользователя с новым токеном
      const userResponse = await fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
      }
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
