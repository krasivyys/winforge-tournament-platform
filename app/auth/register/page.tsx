"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают")
      return
    }

    setIsLoading(true)

    // Имитация регистрации
    setTimeout(() => {
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  const handleOAuthRegister = (provider: string) => {
    setIsLoading(true)

    // Имитация OAuth регистрации
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Навигация */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-yellow-500 font-bold text-2xl">
            WINFORGE
          </Link>
          <Button variant="ghost" className="text-white hover:text-yellow-500" onClick={() => router.push("/")}>
            Назад
          </Button>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-yellow-500">Создайте аккаунт</h1>
            <p className="text-gray-400 mt-2">Присоединяйтесь к сообществу киберспортсменов</p>
          </div>

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="oauth">OAuth</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Имя пользователя</label>
                  <Input
                    name="username"
                    placeholder="Ваш никнейм"
                    className="w-full bg-gray-900 border-gray-700 text-white"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Email</label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="w-full bg-gray-900 border-gray-700 text-white"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Пароль</label>
                  <Input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-900 border-gray-700 text-white"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Подтверждение пароля</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-900 border-gray-700 text-white"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Регистрация..." : "Зарегистрироваться"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="oauth">
              <div className="space-y-4">
                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleOAuthRegister("steam")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.53c-5.263 0-9.53-4.267-9.53-9.53 0-5.263 4.267-9.53 9.53-9.53 5.263 0 9.53 4.267 9.53 9.53 0 5.263-4.267 9.53-9.53 9.53z" />
                    <path d="M16.737 10.27h-4.995V5.275c0-.48-.393-.873-.873-.873s-.873.393-.873.873v4.995H5.001c-.48 0-.873.393-.873.873s.393.873.873.873h4.995v4.995c0 .48.393.873.873.873s.873-.393.873-.873v-4.995h4.995c.48 0 .873-.393.873-.873s-.393-.873-.873-.873z" />
                  </svg>
                  Регистрация через Steam
                </Button>

                <Button
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center gap-2"
                  onClick={() => handleOAuthRegister("discord")}
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.898-.608 1.297a19.41 19.41 0 0 0-5.825 0 12.88 12.88 0 0 0-.617-1.297.077.077 0 0 0-.079-.036 20.03 20.03 0 0 0-4.885 1.49.07.07 0 0 0-.032.028C.533 10.077-.32 15.474.099 20.798a.082.082 0 0 0 .031.056 20.17 20.17 0 0 0 6.067 3.057.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.995a.076.076 0 0 0-.041-.106 13.3 13.3 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.1.246.198.373.292a.077.077 0 0 1-.006.127 12.5 12.5 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 20.09 20.09 0 0 0 6.068-3.057.077.077 0 0 0 .032-.055c.5-5.177-.838-10.53-3.549-14.86a.06.06 0 0 0-.031-.03zM8.02 16.97c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  Регистрация через Discord
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <p className="text-gray-400">
              Уже есть аккаунт?{" "}
              <Link
                href="/"
                className="text-yellow-500 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  router.push("/")
                  // Здесь можно добавить логику для открытия модального окна входа
                }}
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
