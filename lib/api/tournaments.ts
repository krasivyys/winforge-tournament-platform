import type { Tournament, CreateTournamentData, UpdateTournamentData, TournamentBracket } from "@/lib/types"
import { API_URL } from "@/lib/config"
import { getAuthHeader } from "@/lib/api/helpers"

export async function getTournaments(): Promise<Tournament[]> {
  const response = await fetch(`${API_URL}/tournaments`)

  if (!response.ok) {
    throw new Error("Failed to fetch tournaments")
  }

  return response.json()
}

export async function getTournament(tournamentId: string): Promise<Tournament> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}`)

  if (!response.ok) {
    throw new Error("Failed to fetch tournament data")
  }

  return response.json()
}

export async function createTournament(data: CreateTournamentData): Promise<Tournament> {
  const response = await fetch(`${API_URL}/tournaments`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to create tournament")
  }

  return response.json()
}

export async function updateTournament(tournamentId: string, data: UpdateTournamentData): Promise<Tournament> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
    method: "PUT",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to update tournament")
  }

  return response.json()
}

export async function deleteTournament(tournamentId: string): Promise<{ message: string }> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to delete tournament")
  }

  return response.json()
}

export async function joinTournament(tournamentId: string): Promise<Tournament> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}/join`, {
    method: "POST",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to join tournament")
  }

  return response.json()
}

export async function leaveTournament(tournamentId: string): Promise<Tournament> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}/leave`, {
    method: "DELETE",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to leave tournament")
  }

  return response.json()
}

export async function getTournamentBracket(tournamentId: string): Promise<TournamentBracket> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}/bracket`)

  if (!response.ok) {
    throw new Error("Failed to fetch tournament bracket")
  }

  return response.json()
}

export async function generateTournamentBracket(tournamentId: string): Promise<TournamentBracket> {
  const response = await fetch(`${API_URL}/tournaments/${tournamentId}/bracket/generate`, {
    method: "POST",
    headers: getAuthHeader(),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Failed to generate tournament bracket")
  }

  return response.json()
}
