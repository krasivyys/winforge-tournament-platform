"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import Header from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EditProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    bio: "",
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
      bio: "", // Предполагаем, что это поле может быть добавлено в будущем
      steamId: "",
      discordId: "",
    })
  }, [user, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

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
        router.push("/profile")
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

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
          <p className="mb-6">Для доступа к редактированию профиля необходимо войти в систему</p>
          <Button onClick={() => router.push("/auth/login")}>Войти</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Редактирование профиля</h1>
            <p className="text-muted-foreground">Обновите информацию о себе и настройки аккаунта</p>
          </div>

          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
                <CardDescription>Обновите основную информацию вашего профиля</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center space-y-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar || ""} alt={formData.username} />
                    <AvatarFallback className="text-2xl">{formData.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 w-full max-w-md">
                    <Label htmlFor="avatar">URL аватара</Label>
                    <Input
                      id="avatar"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-sm text-muted-foreground">Введите URL изображения для вашего аватара</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">О себе</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Расскажите о себе и своих игровых интересах"
                    rows={4}
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
                <Button variant="outline" type="button" onClick={() => router.push("/profile")}>
                  Отмена
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" type="button">
                    Изменить пароль
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </>
  )
}
