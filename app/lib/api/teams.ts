import type { Team, CreateTeamData, UpdateTeamData, AddTeamMemberData } from "@/lib/types"
import { API_URL } from "@/lib/config"
import { getAuthHeader } from "@/lib/api/helpers"

export async function createTeam(data: CreateTeamData): Promise<Team> {
  const response = await fetch(`${API_URL}/teams`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to create team")
  }

  return response.json()
}

export async function getTeam(teamId: string): Promise<Team> {
  const response = await fetch(`${API_URL}/teams/${teamId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch team data")
  }

  return response.json()
}

export async function updateTeam(teamId: string, data: UpdateTeamData): Promise<Team> {
  const response = await fetch(`${API_URL}/teams/${teamId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update team")
  }

  return response.json()
}

export async function deleteTeam(teamId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/teams/${teamId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to delete team")
  }

  return response.json()
}

export async function addTeamMember(teamId: string, data: AddTeamMemberData): Promise<Team> {
  const response = await fetch(`${API_URL}/teams/${teamId}/members`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to add team member")
  }

  return response.json()
}

export async function removeTeamMember(teamId: string, userId: string): Promise<Team> {
  const response = await fetch(`${API_URL}/teams/${teamId}/members`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to remove team member")
  }

  return response.json()
}
