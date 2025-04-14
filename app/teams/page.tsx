"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface Team {
  id: string
  name: string
  avatar_url: string | null
  captain_id: string
  members: Array<{ user_id: string; is_substitute: boolean }>
  created_at: string
  updated_at: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        // This endpoint is hypothetical and would need to be implemented
        const response = await fetch("/api/v1/teams")
        if (response.ok) {
          const data = await response.json()
          setTeams(data)
          setFilteredTeams(data)
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  useEffect(() => {
    // Apply search filter
    if (searchQuery) {
      const filtered = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredTeams(filtered)
    } else {
      setFilteredTeams(teams)
    }
  }, [teams, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Browse and join gaming teams</p>
        </div>

        {user && (
          <Button asChild>
            <Link href="/teams/create">
              <Plus className="mr-2 h-4 w-4" /> Create Team
            </Link>
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Avatar>
                    <AvatarImage src={team.avatar_url || ""} alt={team.name} />
                    <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">Captain</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>
                    {team.members.length} members ({team.members.filter((m) => !m.is_substitute).length} active)
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/teams/${team.id}`}>View Team</Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No teams found matching your search</p>
            {searchQuery && (
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
