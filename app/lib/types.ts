// User types
export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  role: "user" | "admin"
  created_at: string
  updated_at: string
}

export interface PublicUser {
  id: string
  username: string
  avatar_url?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: User
}

export interface RefreshTokenRequest {
  refresh_token: string
  access_token?: string
}

// Team types
export interface TeamMember {
  user_id: string
  username: string
  avatar_url?: string
  is_captain: boolean
  is_substitute: boolean
  joined_at: string
}

export interface Team {
  id: string
  name: string
  description?: string
  logo_url?: string
  captain_id: string
  members: TeamMember[]
  created_at: string
  updated_at: string
}

export interface CreateTeamData {
  name: string
  description?: string
  logo_url?: string
}

export interface UpdateTeamData {
  name?: string
  description?: string
  logo_url?: string
}

export interface AddTeamMemberData {
  user_id: string
  is_substitute: boolean
}

// Tournament types
export interface Tournament {
  id: string
  name: string
  description: string
  game: string
  format: "single_elimination" | "double_elimination" | "round_robin"
  team_size: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  start_date: string
  end_date: string
  registration_deadline: string
  status: "draft" | "registration" | "in_progress" | "completed"
  max_teams: number
  prize_pool?: string
  organizer_id: string
  created_at: string
  updated_at: string
  participants_count: number
}

export interface CreateTournamentData {
  name: string
  description: string
  game: string
  format: "single_elimination" | "double_elimination" | "round_robin"
  team_size: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  start_date: string
  end_date: string
  registration_deadline: string
  max_teams: number
  prize_pool?: string
}

export interface UpdateTournamentData {
  name?: string
  description?: string
  game?: string
  format?: "single_elimination" | "double_elimination" | "round_robin"
  team_size?: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  start_date?: string
  end_date?: string
  registration_deadline?: string
  status?: "draft" | "registration" | "in_progress" | "completed"
  max_teams?: number
  prize_pool?: string
}

export interface TournamentParticipant {
  id: string
  tournament_id: string
  user_id?: string
  team_id?: string
  username?: string
  team_name?: string
  joined_at: string
}

export interface Match {
  id: string
  tournament_id: string
  round: number
  match_number: number
  participant1_id?: string
  participant2_id?: string
  participant1_name?: string
  participant2_name?: string
  participant1_score?: number
  participant2_score?: number
  winner_id?: string
  status: "pending" | "in_progress" | "completed"
  scheduled_time?: string
}

export interface TournamentBracket {
  tournament_id: string
  rounds: {
    round_number: number
    matches: Match[]
  }[]
}
