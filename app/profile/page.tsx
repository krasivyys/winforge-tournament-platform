"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { format } from "date-fns"
import Header from "@/components/header"

interface UserStats {
  tournaments_played: number
  tournaments_won: number
  matches_played: number
  matches_won: number
  win_rate: number
  rating: number
  rank: number
}

interface UserTeam {
  id: string
  name: string
  avatar_url: string | null
  is_captain: boolean
  members_count: number
  created_at: string
}

interface UserTournament {
  id: string
  name: string
  game: string
  start_date: string
  status: "upcoming" | "ongoing" | "completed" | "canceled"
  position?: number
}

export default function ProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [teams, setTeams] = useState<UserTeam[]>([])
  const [tournaments, setTournaments] = useState<UserTournament[]>([])

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    steamId: "",
    discordId: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Инициализация формы данными пользователя
    setFormData({
      username: user.username || "",
      email: user.email || "",
      avatar: user.avatar || "",
      steamId: "",
      discordId: "",
    })

    const fetchUserData = async () => {
      try {
        // В реальном приложении здесь будут запросы к API
        // Имитация данных для демонстрации

        // Имитация статистики пользователя
        const mockStats: UserStats = {
          tournaments_played: 12,
          tournaments_won: 3,
          matches_played: 48,
          matches_won: 29,
          win_rate: 60.4,
          rating: 1850,
          rank: 342,
        }

        // Имитация команд пользователя
        const mockTeams: UserTeam[] = [
          {
            id: "1",
            name: "Pro Gamers",
            avatar_url: "/placeholder.svg?height=40&width=40",
            is_captain: true,
            members_count: 5,
            created_at: "2025-01-15T14:30:00Z",
          },
          {
            id: "2",
            name: "CS Masters",
            avatar_url: "/placeholder.svg?height=40&width=40",
            is_captain: false,
            members_count: 5,
            created_at: "2025-03-10T09:15:00Z",
          },
        ]

        // Имитация турниров пользователя
        const mockTournaments: UserTournament[] = [
          {
            id: "1",
            name: "CS2 Weekly Cup #12",
            game: "Counter-Strike 2",
            start_date: "2025-05-20T18:00:00Z",
            status: "upcoming",
          },
          {
            id: "2",
            name: "Dota 2 Pro Series Season 2",
            game: "Dota 2",
            start_date: "2025-05-15T16:00:00Z",
            status: "ongoing",
          },
          {
            id: "3",
            name: "CS2 Pro League Season 1",
            game: "Counter-Strike 2",
            start_date: "2025-04-10T14:00:00Z",
            status: "completed",
            position: 3,
          },
          {
            id: "4",
            name: "Valorant Championship",
            game: "Valorant",
            start_date: "2025-03-20T15:00:00Z",
            status: "completed",
            position: 5,
          },
        ]

        setStats(mockStats)
        setTeams(mockTeams)
        setTournaments(mockTournaments)
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          variant: "destructive",
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные пользователя",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user, router, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // В реальном приложении здесь будет запрос к API
      // Имитация успешного обновления
      setTimeout(() => {
        toast({
          title: "Профиль обновлен",
          description: "Ваш профиль успешно обновлен",
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Ошибка обновления профиля",
        description: "Не удалось обновить профиль",
      })
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy")
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="mb-6">Для доступа к личному кабинету необходимо войти в систему</p>
          <Button onClick={() => router.push("/auth/login")}>Войти</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Личный кабинет</h1>
            <p className="text-muted-foreground">Управляйте своим профилем, командами и турнирами</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Боковая панель с информацией о пользователе */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Профиль</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={user.avatar || ""} alt={user.username} />
                      <AvatarFallback className="text-2xl">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{user.username}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" onClick={() => router.push("/profile/edit")}>
                    Редактировать профиль
                  </Button>
                </CardFooter>
              </Card>

              {loading ? (
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ) : stats ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Рейтинг:</span>
                      <span className="font-medium">{stats.rating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ранг:</span>
                      <span className="font-medium">#{stats.rank}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Турниров сыграно:</span>
                      <span className="font-medium">{stats.tournaments_played}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Турниров выиграно:</span>
                      <span className="font-medium">{stats.tournaments_won}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Матчей сыграно:</span>
                      <span className="font-medium">{stats.matches_played}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Матчей выиграно:</span>
                      <span className="font-medium">{stats.matches_won}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Процент побед:</span>
                      <span className="font-medium">{stats.win_rate}%</span>
                    </div>
                  </CardContent>
                </Card>
              ) : null}

              <Card>
                <CardHeader>
                  <CardTitle>Баланс</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold mb-2">{user.balance.toFixed(2)} ₽</div>
                  <p className="text-muted-foreground mb-4">Доступно для вывода</p>
                  <Button className="w-full">Пополнить баланс</Button>
                </CardContent>
              </Card>
            </div>

            {/* Основное содержимое */}
            <div className="md:col-span-2 space-y-6">
              <Tabs defaultValue="teams">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="teams">Мои команды</TabsTrigger>
                  <TabsTrigger value="tournaments">Мои турниры</TabsTrigger>
                  <TabsTrigger value="settings">Настройки</TabsTrigger>
                </TabsList>

                <TabsContent value="teams" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Мои команды</h2>
                    <Button onClick={() => router.push("/teams/create")}>Создать команду</Button>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 2 }).map((_, i) => (
                        <Card key={i}>
                          <CardHeader className="pb-0">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-4 w-1/4" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : teams.length > 0 ? (
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <Card key={team.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={team.avatar_url || ""} alt={team.name} />
                                  <AvatarFallback>{team.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">{team.name}</CardTitle>
                              </div>
                              {team.is_captain && (
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                  Капитан
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <div>Участников: {team.members_count}</div>
                              <div>Создана: {formatDate(team.created_at)}</div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" asChild className="w-full">
                              <a href={`/teams/${team.id}`}>Управление командой</a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">У вас пока нет команд</p>
                        <Button onClick={() => router.push("/teams/create")}>Создать команду</Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="tournaments" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Мои турниры</h2>
                    <Button onClick={() => router.push("/tournaments")}>Найти турниры</Button>
                  </div>

                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                          <CardHeader className="pb-0">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="flex justify-between">
                              <Skeleton className="h-4 w-1/3" />
                              <Skeleton className="h-4  w-1/4" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : tournaments.length > 0 ? (
                    <div className="space-y-4">
                      {tournaments.map((tournament) => (
                        <Card key={tournament.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{tournament.name}</CardTitle>
                              <Badge
                                variant="outline"
                                className={`
                                  ${tournament.status === "upcoming" ? "bg-blue-100 text-blue-800" : ""}
                                  ${tournament.status === "ongoing" ? "bg-green-100 text-green-800" : ""}
                                  ${tournament.status === "completed" ? "bg-gray-100 text-gray-800" : ""}
                                  ${tournament.status === "canceled" ? "bg-red-100 text-red-800" : ""}
                                `}
                              >
                                {tournament.status === "upcoming" && "Предстоящий"}
                                {tournament.status === "ongoing" && "Идет"}
                                {tournament.status === "completed" && "Завершен"}
                                {tournament.status === "canceled" && "Отменен"}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <div>{tournament.game}</div>
                              <div>
                                {tournament.status === "upcoming" && `Начало: ${formatDate(tournament.start_date)}`}
                                {tournament.status === "ongoing" && `Начался: ${formatDate(tournament.start_date)}`}
                                {tournament.status === "completed" &&
                                  tournament.position &&
                                  `Место: ${tournament.position}`}
                                {tournament.status === "completed" &&
                                  !tournament.position &&
                                  `Завершен: ${formatDate(tournament.start_date)}`}
                                {tournament.status === "canceled" && `Отменен: ${formatDate(tournament.start_date)}`}
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="outline" asChild className="w-full">
                              <a href={`/tournaments/${tournament.id}`}>Подробнее</a>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">Вы пока не участвуете ни в одном турнире</p>
                        <Button onClick={() => router.push("/tournaments")}>Найти турниры</Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="settings">
                  <Card>
                    <form onSubmit={handleUpdateProfile}>
                      <CardHeader>
                        <CardTitle>Настройки профиля</CardTitle>
                        <CardDescription>Обновите информацию о себе и настройки аккаунта</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="username">Имя пользователя</Label>
                          <Input id="username" name="username" value={formData.username} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="avatar">URL аватара</Label>
                          <Input
                            id="avatar"
                            name="avatar"
                            value={formData.avatar}
                            onChange={handleInputChange}
                            placeholder="https://example.com/avatar.jpg"
                          />
                        </div>

                        <div className="pt-4 border-t">
                          <h3 className="font-medium mb-4">Подключенные аккаунты</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="steamId">Steam ID</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="steamId"
                                  name="steamId"
                                  value={formData.steamId}
                                  onChange={handleInputChange}
                                  placeholder="Подключите ваш аккаунт Steam"
                                  disabled={!!formData.steamId}
                                />
                                {!formData.steamId && (
                                  <Button variant="outline" type="button">
                                    Подключить
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="discordId">Discord ID</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="discordId"
                                  name="discordId"
                                  value={formData.discordId}
                                  onChange={handleInputChange}
                                  placeholder="Подключите ваш аккаунт Discord"
                                  disabled={!!formData.discordId}
                                />
                                {!formData.discordId && (
                                  <Button variant="outline" type="button">
                                    Подключить
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" type="button">
                          Изменить пароль
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                      </CardFooter>
                    </form>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
