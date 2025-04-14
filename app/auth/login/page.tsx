"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ComputerIcon as Steam, DiscIcon as Discord } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(email, password)
      // Redirect is handled in the auth context
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    try {
      const response = await fetch(`/api/v1/auth/oauth/${provider}`, {
        method: "GET",
      })

      if (response.ok) {
        // This should return a redirect URL
        const data = await response.json()
        window.location.href = data.url
      } else {
        throw new Error(`Failed to initiate ${provider} login`)
      }
    } catch (error) {
      console.error(`${provider} login error:`, error)
      toast({
        variant: "destructive",
        title: `${provider} login failed`,
        description: error instanceof Error ? error.message : `An error occurred during ${provider} login`,
      })
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
          <CardDescription>Введите ваш email и пароль для доступа к аккаунту</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="flex items-center space-x-2 my-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">ИЛИ</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" onClick={() => handleOAuthLogin("steam")} className="w-full">
              <Steam className="mr-2 h-4 w-4" />
              Steam
            </Button>
            <Button variant="outline" type="button" onClick={() => handleOAuthLogin("discord")} className="w-full">
              <Discord className="mr-2 h-4 w-4" />
              Discord
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-center w-full">
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
