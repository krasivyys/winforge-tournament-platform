"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { login, register, logout as apiLogout, refreshToken } from "@/lib/api/auth"
import type { User, LoginCredentials, RegisterData } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken")
        if (accessToken) {
          // Fetch user data or validate token
          const userData = JSON.parse(localStorage.getItem("user") || "null")
          if (userData) {
            setUser(userData)
          } else {
            // If we have a token but no user data, try to refresh
            await refreshUser()
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const data = await login(credentials)
      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await register(data)
      localStorage.setItem("accessToken", response.access_token)
      localStorage.setItem("refreshToken", response.refresh_token)
      localStorage.setItem("user", JSON.stringify(response.user))
      setUser(response.user)
      toast({
        title: "Registration successful",
        description: `Welcome, ${response.user.username}!`,
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")
      if (accessToken) {
        await apiLogout()
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    }
  }

  const refreshUser = async () => {
    const refreshTokenValue = localStorage.getItem("refreshToken")
    const accessTokenValue = localStorage.getItem("accessToken")

    if (!refreshTokenValue) return

    try {
      const data = await refreshToken({
        refresh_token: refreshTokenValue,
        access_token: accessTokenValue || undefined,
      })

      localStorage.setItem("accessToken", data.access_token)
      localStorage.setItem("refreshToken", data.refresh_token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      return data
    } catch (error) {
      console.error("Token refresh failed:", error)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("user")
      setUser(null)
    }
  }

  const value = {
    user,
    isLoading,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
