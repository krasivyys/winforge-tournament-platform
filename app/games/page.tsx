"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Header from "@/components/header"

interface Game {
  id: string
  name: string
  description: string
  image_url: string
  active_tournaments: number
  total_tournaments: number
  player_count: number
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchGames = async () => {
      try {
        // В реальном приложении здесь будет запрос к API
        // const response = await fetch("/api/v1/games")
        // const data = await response.json()

        // Имитация данных для демонстрации
        const mockGames: Game[] = [
          {
            id: "1",
            name: "Counter-Strike 2",
            description: "Популярный командный шутер от первого лица, разработанный Valve Corporation.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 12,
            total_tournaments: 156,
            player_count: 8745,
          },
          {
            id: "2",
            name: "Dota 2",
            description: "Многопользовательская онлайн-игра в жанре MOBA, разработанная Valve Corporation.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 8,
            total_tournaments: 124,
            player_count: 6532,
          },
          {
            id: "3",
            name: "Valorant",
            description: "Тактический шутер от первого лица, разработанный Riot Games.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 5,
            total_tournaments: 78,
            player_count: 4321,
          },
          {
            id: "4",
            name: "League of Legends",
            description: "Многопользовательская онлайн-игра в жанре MOBA, разработанная Riot Games.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 7,
            total_tournaments: 112,
            player_count: 7890,
          },
          {
            id: "5",
            name: "Fortnite",
            description: "Многопользовательская онлайн-игра в жанре королевской битвы, разработанная Epic Games.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 6,
            total_tournaments: 98,
            player_count: 5678,
          },
          {
            id: "6",
            name: "Apex Legends",
            description:
              "Многопользовательская онлайн-игра в жанре королевской битвы, разработанная Respawn Entertainment.",
            image_url: "/placeholder.svg?height=300&width=500",
            active_tournaments: 4,
            total_tournaments: 67,
            player_count: 3456,
          },
        ]

        setGames(mockGames)
        setFilteredGames(mockGames)
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [])

  useEffect(() => {
    // Применяем поисковый фильтр
    if (searchQuery) {
      const filtered = games.filter((game) => game.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredGames(filtered)
    } else {
      setFilteredGames(games)
    }
  }, [games, searchQuery])

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Доступные игры</h1>
              <p className="text-muted-foreground">Выберите игру и участвуйте в турнирах</p>
            </div>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск игр..."
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
                    <Skeleton className="h-40 w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-40 bg-gray-200 rounded-md overflow-hidden">
                      <img
                        src={game.image_url || "/placeholder.svg"}
                        alt={game.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {game.active_tournaments} активных турниров
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {game.player_count.toLocaleString()} игроков
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <Link href={`/tournaments?game=${game.id}`}>Смотреть турниры</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Игры не найдены</p>
                {searchQuery && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                    Сбросить поиск
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
