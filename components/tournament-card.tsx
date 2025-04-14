import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TournamentCardProps {
  id: string
  name: string
  game: string
  format: "single_elim" | "double_elim" | "round_robin"
  startDate: string
  teamSize: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  prizePool: number
  status: "upcoming" | "ongoing" | "completed" | "canceled"
}

const formatMap: Record<string, string> = {
  single_elim: "Одиночное выбывание",
  double_elim: "Двойное выбывание",
  round_robin: "Круговая система",
}

const teamSizeMap: Record<string, string> = {
  "1x1": "Соло",
  "2x2": "Дуо",
  "3x3": "Трио",
  "4x4": "4 на 4",
  "5x5": "5 на 5",
}

export const TournamentCard: React.FC<TournamentCardProps> = ({
  id,
  name,
  game,
  format,
  startDate,
  teamSize,
  prizePool,
  status,
}) => {
  return (
    <Card className="border border-winforge-dark-blue bg-black/50 rounded-lg overflow-hidden hover-scale hover:border-winforge-blue transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge className="bg-winforge-blue text-white hover:bg-winforge-blue-light">{game}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <span>Начало {formatDistanceToNow(new Date(startDate), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center text-sm">
          <Trophy className="mr-2 h-4 w-4 text-gray-400" />
          <span>Призовой фонд: {prizePool.toLocaleString("ru-RU")} ₽</span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="mr-2 h-4 w-4 text-gray-400" />
          <span>
            {teamSizeMap[teamSize]} • {formatMap[format]}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-winforge-blue hover:bg-winforge-blue-dark text-white">
          <Link href={`/tournaments/${id}`}>Подробнее</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
