"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MessageSquare, ThumbsUp, Calendar, Users } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import Header from "@/components/header"

interface ForumTopic {
  id: string
  title: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  created_at: string
  replies: number
  views: number
  last_reply?: {
    author: {
      id: string
      username: string
      avatar?: string
    }
    created_at: string
  }
}

interface NewsArticle {
  id: string
  title: string
  content: string
  image_url?: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  created_at: string
  likes: number
  comments: number
}

interface Event {
  id: string
  title: string
  description: string
  start_date: string
  end_date: string
  location: string
  participants: number
  max_participants: number
  image_url?: string
}

export default function CommunityPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTopicContent, setNewTopicContent] = useState("")

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        // В реальном приложении здесь будут запросы к API
        // Имитация данных для демонстрации

        // Имитация форумных тем
        const mockTopics: ForumTopic[] = [
          {
            id: "1",
            title: "Обсуждение последнего обновления CS2",
            author: {
              id: "user1",
              username: "ProGamer",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-15T14:30:00Z",
            replies: 24,
            views: 156,
            last_reply: {
              author: {
                id: "user2",
                username: "CS_Master",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              created_at: "2025-05-16T09:45:00Z",
            },
          },
          {
            id: "2",
            title: "Стратегии для новичков в Dota 2",
            author: {
              id: "user3",
              username: "DotaFan",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-14T10:15:00Z",
            replies: 18,
            views: 132,
            last_reply: {
              author: {
                id: "user4",
                username: "MidOrFeed",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              created_at: "2025-05-16T08:20:00Z",
            },
          },
          {
            id: "3",
            title: "Ищу команду для участия в турнире по Valorant",
            author: {
              id: "user5",
              username: "ValorantPro",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-13T16:45:00Z",
            replies: 12,
            views: 98,
            last_reply: {
              author: {
                id: "user6",
                username: "HeadshotKing",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              created_at: "2025-05-15T19:30:00Z",
            },
          },
          {
            id: "4",
            title: "Обсуждение предстоящего турнира CS2 Pro League",
            author: {
              id: "user7",
              username: "TournamentFan",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-12T11:20:00Z",
            replies: 31,
            views: 215,
            last_reply: {
              author: {
                id: "user8",
                username: "ESportLover",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              created_at: "2025-05-16T07:15:00Z",
            },
          },
          {
            id: "5",
            title: "Техническая поддержка: проблемы с регистрацией на турнир",
            author: {
              id: "user9",
              username: "NeedHelp",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-11T09:10:00Z",
            replies: 8,
            views: 67,
            last_reply: {
              author: {
                id: "user10",
                username: "SupportTeam",
                avatar: "/placeholder.svg?height=40&width=40",
              },
              created_at: "2025-05-15T14:25:00Z",
            },
          },
        ]

        // Имитация новостей
        const mockNews: NewsArticle[] = [
          {
            id: "1",
            title: "Анонс нового сезона CS2 Pro League",
            content:
              "Мы рады объявить о начале нового сезона CS2 Pro League! Регистрация команд уже открыта, а призовой фонд составляет 1 000 000 рублей. Не упустите свой шанс стать чемпионом!",
            image_url: "/placeholder.svg?height=200&width=400",
            author: {
              id: "admin1",
              username: "WinforgeAdmin",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-15T12:00:00Z",
            likes: 156,
            comments: 42,
          },
          {
            id: "2",
            title: "Обновление платформы: новые функции и улучшения",
            content:
              "Мы выпустили крупное обновление платформы, которое включает в себя новые функции для команд, улучшенную систему турниров и многое другое. Ознакомьтесь с полным списком изменений!",
            image_url: "/placeholder.svg?height=200&width=400",
            author: {
              id: "admin2",
              username: "DevTeam",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-14T15:30:00Z",
            likes: 98,
            comments: 27,
          },
          {
            id: "3",
            title: "Интервью с победителями Dota 2 Masters Cup",
            content:
              "Мы побеседовали с командой, которая стала чемпионом недавнего турнира Dota 2 Masters Cup. Узнайте о их стратегии, подготовке и планах на будущее!",
            image_url: "/placeholder.svg?height=200&width=400",
            author: {
              id: "admin3",
              username: "ContentManager",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            created_at: "2025-05-13T10:45:00Z",
            likes: 124,
            comments: 36,
          },
        ]

        // Имитация событий
        const mockEvents: Event[] = [
          {
            id: "1",
            title: "CS2 Pro League Season 1",
            description: "Профессиональная лига по Counter-Strike 2 с призовым фондом 1 000 000 рублей.",
            start_date: "2025-06-15T14:00:00Z",
            end_date: "2025-08-15T20:00:00Z",
            location: "Онлайн",
            participants: 32,
            max_participants: 64,
            image_url: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "2",
            title: "Dota 2 Masters Cup",
            description: "Турнир по Dota 2 для команд всех уровней с призовым фондом 500 000 рублей.",
            start_date: "2025-06-10T18:00:00Z",
            end_date: "2025-07-10T22:00:00Z",
            location: "Онлайн",
            participants: 48,
            max_participants: 64,
            image_url: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "3",
            title: "Valorant Championship",
            description: "Чемпионат по Valorant с призовым фондом 300 000 рублей.",
            start_date: "2025-06-20T16:00:00Z",
            end_date: "2025-07-20T20:00:00Z",
            location: "Онлайн",
            participants: 24,
            max_participants: 32,
            image_url: "/placeholder.svg?height=200&width=400",
          },
          {
            id: "4",
            title: "Мастер-класс от профессиональных игроков CS2",
            description:
              "Онлайн-мастер-класс от профессиональных игроков CS2, где вы сможете узнать секреты успеха и задать вопросы.",
            start_date: "2025-05-25T17:00:00Z",
            end_date: "2025-05-25T19:00:00Z",
            location: "Онлайн (Zoom)",
            participants: 156,
            max_participants: 200,
            image_url: "/placeholder.svg?height=200&width=400",
          },
        ]

        setTopics(mockTopics)
        setNews(mockNews)
        setEvents(mockEvents)
      } catch (error) {
        console.error("Error fetching community data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  const handleCreateTopic = () => {
    if (!user) {
      return
    }

    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      return
    }

    // В реальном приложении здесь будет запрос к API для создания новой темы
    console.log("Создание новой темы:", { title: newTopicTitle, content: newTopicContent })

    // Сбрасываем форму
    setNewTopicTitle("")
    setNewTopicContent("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">Сообщество</h1>
          <p className="text-xl text-muted-foreground">
            Общайтесь с другими игроками, следите за новостями и участвуйте в событиях
          </p>
        </div>

        <Tabs defaultValue="forum" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="forum">Форум</TabsTrigger>
            <TabsTrigger value="news">Новости</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
          </TabsList>

          <TabsContent value="forum">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Поиск тем..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>Создать тему</Button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
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
              ) : (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          <a href={`/community/forum/${topic.id}`} className="hover:text-blue-500">
                            {topic.title}
                          </a>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={topic.author.avatar} alt={topic.author.username} />
                              <AvatarFallback>{topic.author.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{topic.author.username}</span>
                            <span>•</span>
                            <span>{formatDate(topic.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 md:mt-0">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{topic.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Просмотров:</span>
                              <span>{topic.views}</span>
                            </div>
                          </div>
                        </div>
                        {topic.last_reply && (
                          <div className="mt-2 text-sm border-t pt-2">
                            <span className="text-muted-foreground">Последний ответ от </span>
                            <span className="font-medium">{topic.last_reply.author.username}</span>
                            <span className="text-muted-foreground"> • {formatDate(topic.last_reply.created_at)}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {user && (
                <Card className="mt-8">
                  <CardHeader>
                    <CardTitle>Создать новую тему</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="topic-title" className="text-sm font-medium">
                        Заголовок
                      </label>
                      <Input
                        id="topic-title"
                        placeholder="Введите заголовок темы"
                        value={newTopicTitle}
                        onChange={(e) => setNewTopicTitle(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="topic-content" className="text-sm font-medium">
                        Содержание
                      </label>
                      <Textarea
                        id="topic-content"
                        placeholder="Введите содержание темы"
                        rows={5}
                        value={newTopicContent}
                        onChange={(e) => setNewTopicContent(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleCreateTopic}>Создать тему</Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="news">
            <div className="space-y-8">
              {loading ? (
                <div className="space-y-8">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-0">
                        <Skeleton className="h-8 w-3/4 mb-2" />
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                news.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        <a href={`/community/news/${article.id}`} className="hover:text-blue-500">
                          {article.title}
                        </a>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {article.image_url && (
                        <div className="h-64 bg-gray-200 rounded-md overflow-hidden">
                          <img
                            src={article.image_url || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <p>{article.content}</p>
                      <div className="flex flex-col md:flex-row justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={article.author.avatar} alt={article.author.username} />
                            <AvatarFallback>{article.author.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{article.author.username}</span>
                          <span>•</span>
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 md:mt-0">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{article.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{article.comments}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" asChild>
                        <a href={`/community/news/${article.id}`}>Читать полностью</a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i}>
                      <CardHeader className="pb-0">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                      </CardHeader>
                      <CardContent className="pt-6">
                        <Skeleton className="h-40 w-full mb-4" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-2/3" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-10 w-full" />
                      </CardFooter>
                    </Card>
                  ))
                : events.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle>{event.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {event.image_url && (
                          <div className="h-40 bg-gray-200 rounded-md overflow-hidden">
                            <img
                              src={event.image_url || "/placeholder.svg"}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Начало: {formatDate(event.start_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Окончание: {formatDate(event.end_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Участники: {event.participants}/{event.max_participants}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <a href={`/community/events/${event.id}`}>Подробнее</a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
