"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TournamentCard } from "@/components/tournament-card"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, Filter } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Header from "@/components/header"

interface Tournament {
  id: string
  name: string
  game: string
  format: "single_elim" | "double_elim" | "round_robin"
  status: "upcoming" | "ongoing" | "completed" | "canceled"
  team_size: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  start_date: string
  prize_pool: number
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [gameFilter, setGameFilter] = useState("all")
  const [teamSizeFilter, setTeamSizeFilter] = useState("all")
  const [games, setGames] = useState<string[]>([])

  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        // В реальном приложении здесь будет запрос к API
        // const data = await tournamentsApi.getAll()

        // Имитация данных для демонстрации
        const mockTournaments: Tournament[] = [
          {
            id: "1",
            name: "CS2 Pro League Season 1",
            game: "Counter-Strike 2",
            format: "double_elim",
            status: "upcoming",
            team_size: "5x5",
            start_date: "2025-06-15T14:00:00Z",
            prize_pool: 1000000,
          },
          {
            id: "2",
            name: "Dota 2 Masters Cup",
            game: "Dota 2",
            format: "single_elim",
            status: "upcoming",
            team_size: "5x5",
            start_date: "2025-06-10T18:00:00Z",
            prize_pool: 750000,
          },
          {
            id: "3",
            name: "Valorant Championship",
            game: "Valorant",
            format: "round_robin",
            status: "upcoming",
            team_size: "5x5",
            start_date: "2025-06-20T16:00:00Z",
            prize_pool: 500000,
          },
          {
            id: "4",
            name: "CS2 Weekly Cup #12",
            game: "Counter-Strike 2",
            format: "single_elim",
            status: "ongoing",
            team_size: "5x5",
            start_date: "2025-05-25T14:00:00Z",
            prize_pool: 100000,
          },
          {
            id: "5",
            name: "Dota 2 Pro Series Season 2",
            game: "Dota 2",
            format: "double_elim",
            status: "ongoing",
            team_size: "5x5",
            start_date: "2025-05-20T16:00:00Z",
            prize_pool: 250000,
          },
          {
            id: "6",
            name: "Fortnite Solo Tournament",
            game: "Fortnite",
            format: "single_elim",
            status: "upcoming",
            team_size: "1x1",
            start_date: "2025-06-25T15:00:00Z",
            prize_pool: 300000,
          },
          {
            id: "7",
            name: "League of Legends Cup",
            game: "League of Legends",
            format: "double_elim",
            status: "upcoming",
            team_size: "5x5",
            start_date: "2025-06-18T17:00:00Z",
            prize_pool: 500000,
          },
          {
            id: "8",
            name: "Apex Legends Trio Challenge",
            game: "Apex Legends",
            format: "round_robin",
            status: "upcoming",
            team_size: "3x3",
            start_date: "2025-06-22T15:00:00Z",
            prize_pool: 200000,
          },
          {
            id: "9",
            name: "CS2 Pro League Season 0",
            game: "Counter-Strike 2",
            format: "double_elim",
            status: "completed",
            team_size: "5x5",
            start_date: "2025-04-15T14:00:00Z",
            prize_pool: 800000,
          },
        ]

        setTournaments(mockTournaments)
        setFilteredTournaments(mockTournaments)

        // Извлекаем уникальные игры для фильтра
        const uniqueGames = [...new Set(mockTournaments.map((t) => t.game))]
        setGames(uniqueGames)
      } catch (error) {
        console.error("Error fetching tournaments:", error)
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить список турниров",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTournaments()
  }, [toast])

  useEffect(() => {
    // Применяем фильтры
    let result = tournaments

    // Поиск по названию или игре
    if (searchQuery) {
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.game.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Фильтр по статусу
    if (statusFilter !== "all") {
      result = result.filter((t) => t.status === statusFilter)
    }

    // Фильтр по игре
    if (gameFilter !== "all") {
      result = result.filter((t) => t.game === gameFilter)
    }

    // Фильтр по размеру команды
    if (teamSizeFilter !== "all") {
      result = result.filter((t) => t.team_size === teamSizeFilter)
    }

    setFilteredTournaments(result)
  }, [tournaments, searchQuery, statusFilter, gameFilter, teamSizeFilter])

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Турниры</h1>
              <p className="text-muted-foreground">Найдите и примите участие в турнирах</p>
            </div>

            <Button asChild>
              <Link href="/tournaments/create">
                <Plus className="mr-2 h-4 w-4" />
                Создать турнир
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск турниров..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="upcoming">Предстоящие</SelectItem>
                  <SelectItem value="ongoing">Идущие</SelectItem>
                  <SelectItem value="completed">Завершенные</SelectItem>
                  <SelectItem value="canceled">Отмененные</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={gameFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setGameFilter("all")}
            >
              Все игры
            </Button>
            {games.map((game) => (
              <Button
                key={game}
                variant={gameFilter === game ? "default" : "outline"}
                size="sm"
                onClick={() => setGameFilter(game)}
              >
                {game}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4 space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  id={tournament.id}
                  name={tournament.name}
                  game={tournament.game}
                  format={tournament.format}
                  startDate={tournament.start_date}
                  teamSize={tournament.team_size}
                  prizePool={tournament.prize_pool}
                  status={tournament.status}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Турниры не найдены</h3>
              <p className="text-muted-foreground mb-6">По вашему запросу не найдено ни одного турнира</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setGameFilter("all")
                  setTeamSizeFilter("all")
                }}
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
