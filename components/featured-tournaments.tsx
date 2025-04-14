"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Calendar, Trophy, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { tournamentsApi } from "@/lib/api"

interface Tournament {
  id: string
  name: string
  game: string
  format: string
  status: string
  team_size: string
  start_date: string
  prize_pool: number
}

export default function FeaturedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const data = await tournamentsApi.getUpcoming()
        // Получаем предстоящие турниры и сортируем по дате начала
        const upcomingTournaments = data
          .sort((a: Tournament, b: Tournament) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
          .slice(0, 3) // Берем только 3 турнира

        setTournaments(upcomingTournaments)
      } catch (error) {
        console.error("Error fetching tournaments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [])

  const formatTeamSize = (size: string) => {
    switch (size) {
      case "1x1":
        return "Solo"
      case "2x2":
        return "Duo"
      case "3x3":
        return "Trio"
      case "4x4":
        return "Squad"
      case "5x5":
        return "Team"
      default:
        return size
    }
  }

  const formatTournamentFormat = (format: string) => {
    switch (format) {
      case "single_elim":
        return "Single Elimination"
      case "double_elim":
        return "Double Elimination"
      case "round_robin":
        return "Round Robin"
      default:
        return format
    }
  }

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Featured Tournaments</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Check out these upcoming tournaments and register to participate
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : tournaments.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-8">
          {tournaments.map((tournament) => (
            <Card key={tournament.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{tournament.name}</CardTitle>
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                    {tournament.game}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Starts {formatDistanceToNow(new Date(tournament.start_date), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Prize pool: ${tournament.prize_pool.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {formatTeamSize(tournament.team_size)} • {formatTournamentFormat(tournament.format)}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/tournaments/${tournament.id}`}>View Tournament</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No upcoming tournaments found</p>
          <Button asChild className="mt-4">
            <Link href="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      )}

      {tournaments.length > 0 && (
        <div className="text-center mt-8">
          <Button asChild variant="outline">
            <Link href="/tournaments">View All Tournaments</Link>
          </Button>
        </div>
      )}
    </section>
  )
}
