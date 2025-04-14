"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Trophy, Users, Clock, User, UserPlus, UserMinus } from "lucide-react"
import TournamentBracket from "@/components/tournament-bracket"

interface Tournament {
  id: string
  name: string
  game: string
  format: "single_elim" | "double_elim" | "round_robin"
  status: "upcoming" | "ongoing" | "completed" | "canceled"
  organizer_id: string
  max_players: number
  entry_fee: number
  prize_pool: number
  prize_pool_type: string
  team_size: "1x1" | "2x2" | "3x3" | "4x4" | "5x5"
  player_ids: string[]
  team_ids: string[]
  created_at: string
  start_date: string
  description: string | null
}

const formatMap: Record<string, string> = {
  single_elim: "Single Elimination",
  double_elim: "Double Elimination",
  round_robin: "Round Robin",
}

const statusMap: Record<string, { label: string; color: string }> = {
  upcoming: { label: "Предстоящий", color: "bg-blue-500" },
  ongoing: { label: "Идет", color: "bg-green-500" },
  completed: { label: "Завершен", color: "bg-gray-500" },
  canceled: { label: "Отменен", color: "bg-red-500" },
}

const teamSizeMap: Record<string, string> = {
  "1x1": "Соло",
  "2x2": "Дуо",
  "3x3": "Трио",
  "4x4": "4 на 4",
  "5x5": "5 на 5",
}

export default function TournamentPage() {
  const { id } = useParams() as { id: string }
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(true)
  const [isJoining, setIsJoining] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isUserRegistered, setIsUserRegistered] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await fetch(`/api/v1/tournaments/${id}`)
        if (response.ok) {
          const data = await response.json()
          setTournament(data)

          // Проверяем, зарегистрирован ли пользователь
          if (user) {
            if (data.team_size === "1x1") {
              setIsUserRegistered(data.player_ids.includes(user.id))
            } else {
              // Для командных турниров нужно проверить, зарегистрирована ли команда пользователя
              // Это упрощенная версия, в реальности нужно получить команды пользователя
              const userTeamResponse = await fetch("/api/v1/teams/my", {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
              })

              if (userTeamResponse.ok) {
                const userTeams = await userTeamResponse.json()
                const userTeamIds = userTeams.map((team: any) => team.id)
                const isTeamRegistered = data.team_ids.some((teamId: string) => userTeamIds.includes(teamId))
                setIsUserRegistered(isTeamRegistered)
              }
            }
          }
        } else {
          throw new Error("Не удалось загрузить информацию о турнире")
        }
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить информацию о турнире",
          variant: "destructive",
        })
        router.push("/tournaments")
      } finally {
        setLoading(false)
      }
    }

    fetchTournament()
  }, [id, user, router, toast])

  const handleJoinTournament = async () => {
    if (!user) {
      toast({
        title: "Требуется авторизация",
        description: "Пожалуйста, войдите в систему, чтобы принять участие в турнире",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    setIsJoining(true)
    try {
      const response = await fetch(`/api/v1/tournaments/${id}/join`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        setIsUserRegistered(true)
        toast({
          title: "Успешно",
          description: "Вы успешно зарегистрировались на турнир",
        })
      } else {
        const error = await response.json()
        throw new Error(error.detail?.message || "Не удалось зарегистрироваться на турнир")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      })
    } finally {
      setIsJoining(false)
    }
  }

  const handleLeaveTournament = async () => {
    setIsLeaving(true)
    try {
      const response = await fetch(`/api/v1/tournaments/${id}/leave`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })

      if (response.ok) {
        setIsUserRegistered(false)
        toast({
          title: "Успешно",
          description: "Вы успешно отменили регистрацию на турнир",
        })
      } else {
        const error = await response.json()
        throw new Error(error.detail?.message || "Не удалось отменить регистрацию")
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Произошла ошибка при отмене регистрации",
        variant: "destructive",
      })
    } finally {
      setIsLeaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <Skeleton className="h-7 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <Skeleton className="h-7 w-32 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full" />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <Skeleton className="h-7 w-32 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <Skeleton className="h-7 w-32 mb-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!tournament) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Турнир не найден</h1>
        <p className="text-gray-400 mb-6">Запрашиваемый турнир не существует или был удален</p>
        <Button onClick={() => router.push("/tournaments")}>Вернуться к списку турниров</Button>
      </div>
    )
  }

  const formattedDate = new Date(tournament.start_date).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const statusInfo = statusMap[tournament.status]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{tournament.name}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className="bg-purple-600 hover:bg-purple-700">
              {tournament.game}
            </Badge>
            <Badge className={`${statusInfo.color} hover:${statusInfo.color}`}>
              {statusInfo.label}
            </Badge>
          </div>
        </div>

        {user && tournament.status === 'upcoming' && (
          isUserRegistered ? (
            <Button 
              variant="destructive" 
              onClick={handleLeaveTournament} 
              disabled={isLeaving}
            >
              {isLeaving ? (
                'Отмена регистрации...'
              ) : (
                <>
                  <UserMinus className="mr-2 h-4 w-4" /> Отменить регистрацию
                </>
              )}
            </Button>
          ) : (
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleJoinTournament} 
              disabled={isJoining}
            >
              {isJoining ? (
                'Регистрация...'
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" /> Принять участие
                </>
              )}
            </Button>
          )
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">Информация</TabsTrigger>
              <TabsTrigger value="bracket">Сетка</TabsTrigger>
              <TabsTrigger value="participants">Участники</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Детали турнира</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tournament.description && (
                    <div>
                      <h3 className="font-medium mb-2">Описание</h3>
                      <p>{tournament.description}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Формат</h3>
                    <p>{formatMap[tournament.format]}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Размер команды</h3>
                    <p>{teamSizeMap[tournament.team_size]}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Призовой фонд</h3>
                    <p>{tournament.prize_pool.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-sm text-gray-400">
                      {tournament.prize_pool_type === 'static' 
                        ? 'Фиксированный призовой фонд' 
                        : 'Призовой фонд формируется из взносов участников'}
                    </p>
                  </div>

                  {tournament.entry_fee > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Взнос за участие</h3>
                      <p>{tournament.entry_fee.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {tournament.status === 'ongoing' || tournament.status === 'completed' ? (
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Результаты матчей</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">
                      {tournament.status === 'ongoing'
                        ? 'Матчи в процессе. Проверьте вкладку "Сетка" для получения актуальной информации.'
                        : 'Турнир завершен. Посмотрите итоговые результаты во вкладке "Сетка".'
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-gray-800 bg-gray-900/50">
                  <CardHeader>
                    <CardTitle>Правила и руководства</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        Все участники должны следовать правилам турнира. Несоблюдение правил может привести к дисквалификации.
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Уважайте всех участников и организаторов</li>
                        <li>Присоединяйтесь к лобби турнира минимум за 15 минут до начала матча</li>
                        <li>Сообщайте о результатах матчей сразу после их завершения</li>
                        <li>Следуйте всем правилам и регламентам игры</li>
                      </ul>
                    </div>
                  </CardContent>\
                </Card>
              )}
            </TabsContent>

            <TabsContent value="bracket">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Сетка турнира</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.status === 'upcoming' ? (
                    <div className="text-center py-8">
                      <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400">
                        Сетка будет доступна после начала турнира {formattedDate}
                      </p>
                    </div>
                  ) : (
                    <TournamentBracket tournamentId={tournament.id} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants">
              <Card className="border-gray-800 bg-gray-900/50">
                <CardHeader>
                  <CardTitle>Участники</CardTitle>
                </CardHeader>
                <CardContent>
                  {tournament.player_ids.length === 0 && tournament.team_ids.length === 0 ? (
                    <div className="text-center py-8">
                      <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-400">Пока никто не зарегистрировался на этот турнир</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-400">
                        {tournament.team_size === '1x1'
                          ? `Зарегистрировано ${tournament.player_ids.length} из ${tournament.max_players} игроков`
                          : `Зарегистрировано ${tournament.team_ids.length} из ${tournament.max_players} команд`}
                      </p>
                      
                      {/* Здесь будет список участников */}
                      <p className="text-gray-400">Список участников загружается...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Информация о турнире</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-400" />
                <span>Призовой фонд: {tournament.prize_pool.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span>
                  {teamSizeMap[tournament.team_size]} • {formatMap[tournament.format]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span>Максимум участников: {tournament.max_players}</span>
              </div>
            </CardContent>
          </Card>

          {tournament.status === 'upcoming' && (
            <Card className="border-gray-800 bg-gray-900/50">
              <CardHeader>
                <CardTitle>Регистрация</CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  isUserRegistered ? (
                    <div className="space-y-4">
                      <p className="text-green-500 font-medium">Вы зарегистрированы на этот турнир</p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLeaveTournament}
                        disabled={isLeaving}
                      >
                        {isLeaving ? 'Отмена регистрации...' : 'Отменить регистрацию'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p>
                        {tournament.team_size === '1x1'
                          ? 'Зарегистрируйтесь как игрок, чтобы принять участие в этом турнире'
                          : `Это турнир формата ${teamSizeMap[tournament.team_size]}. Вам нужно быть капитаном команды, чтобы зарегистрироваться.`}
                      </p>
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700" 
                        onClick={handleJoinTournament} 
                        disabled={isJoining}
                      >
                        {isJoining ? 'Регистрация...' : 'Принять участие'}
                      </Button>
                    </div>
                  )
                ) : (
                  <div className="space-y-4">
                    <p>Вам необходимо войти в систему, чтобы принять участие в этом турнире</p>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700" 
                      onClick={() => router.push('/auth/login')}
                    >
                      Войти для участия
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
