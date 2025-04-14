"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { setManualToken } from "@/lib/token-initializer"
import { useToast } from "@/components/ui/use-toast"

export default function SetTokenPage() {
  const [token, setToken] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSetToken = () => {
    if (!token.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите токен",
        variant: "destructive",
      })
      return
    }

    try {
      setManualToken(token.trim())
      toast({
        title: "Успешно",
        description: "Токен доступа установлен",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось установить токен",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-10 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Установка токена доступа</CardTitle>
          <CardDescription>Введите JWT токен для авторизации в API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input placeholder="Введите Bearer токен" value={token} onChange={(e) => setToken(e.target.value)} />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSetToken} className="w-full">
            Установить токен
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
