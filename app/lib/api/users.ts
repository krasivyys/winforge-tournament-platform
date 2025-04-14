import type { User, PublicUser } from "@/lib/types"
import { API_URL } from "@/lib/config"
import { getAuthHeader } from "@/lib/api/helpers"

export async function getCurrentUser(): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch user data")
  }

  return response.json()
}

export async function updateUserProfile(data: Partial<User>): Promise<User> {
  const response = await fetch(`${API_URL}/users/me`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update profile")
  }

  return response.json()
}

export async function getUserById(userId: string): Promise<PublicUser> {
  const response = await fetch(`${API_URL}/users/${userId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user data")
  }

  return response.json()
}
