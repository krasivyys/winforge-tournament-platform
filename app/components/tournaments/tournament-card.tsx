import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Tournament } from "@/lib/types"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Users, Calendar, Trophy } from "lucide-react"

interface TournamentCardProps {
  tournament: Tournament
}

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-muted text-muted-foreground"
      case "registration":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatTeamSize = (size: string) => {
    return size.replace("x", " vs ")
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{tournament.name}</CardTitle>
          <Badge className={getStatusColor(tournament.status)}>{tournament.status.replace("_", " ")}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">{tournament.description}</p>

          <div className="flex items-center text-sm">
            <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{tournament.game}</span>
          </div>

          <div className="flex items-center text-sm">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>
              {formatTeamSize(tournament.team_size)} • {tournament.format.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatDate(tournament.start_date)}</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {tournament.participants_count} / {tournament.max_teams} participants
            </span>
            {tournament.prize_pool && (
              <Badge variant="outline" className="ml-2">
                Prize: {tournament.prize_pool}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/tournaments/${tournament.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
