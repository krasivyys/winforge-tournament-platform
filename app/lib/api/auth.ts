import type { LoginCredentials, RegisterData, TokenResponse, RefreshTokenRequest } from "@/lib/types"
import { API_URL } from "@/lib/config"

export async function login(credentials: LoginCredentials): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Login failed")
  }

  return response.json()
}

export async function register(data: RegisterData): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Registration failed")
  }

  return response.json()
}

export async function logout(): Promise<void> {
  const token = localStorage.getItem("accessToken")
  if (!token) return

  const response = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.error("Logout failed:", await response.json())
  }
}

export async function refreshToken(data: RefreshTokenRequest): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Token refresh failed")
  }

  return response.json()
}

export async function loginWithOAuth(provider: "steam" | "discord"): Promise<void> {
  window.location.href = `${API_URL}/auth/oauth/${provider}`
}
