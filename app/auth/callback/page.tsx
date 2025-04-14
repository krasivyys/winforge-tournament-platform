"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { setAccessToken } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function OAuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Получаем токен из URL параметров
        const token = searchParams.get("token")
        const error = searchParams.get("error")

        if (error) {
          setStatus("error")
          setErrorMessage(error)
          toast({
            variant: "destructive",
            title: "Ошибка авторизации",
            description: error,
          })
          return
        }

        if (!token) {
          setStatus("error")
          setErrorMessage("Токен не найден в URL")
          toast({
            variant: "destructive",
            title: "Ошибка авторизации",
            description: "Токен не найден в URL",
          })
          return
        }

        // Сохраняем токен
        setAccessToken(token)
        setStatus("success")

        toast({
          title: "Авторизация успешна",
          description: "Вы успешно авторизовались",
        })

        // Перенаправляем на главную страницу
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (error) {
        console.error("Ошибка обработки OAuth callback:", error)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Неизвестная ошибка")

        toast({
          variant: "destructive",
          title: "Ошибка авторизации",
          description: error instanceof Error ? error.message : "Произошла ошибка при авторизации",
        })
      }
    }

    processCallback()
  }, [searchParams, router, toast])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Обработка авторизации...</h1>
            <p>Пожалуйста, подождите, мы завершаем процесс авторизации.</p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-500">Авторизация успешна!</h1>
            <p>Вы будете перенаправлены на главную страницу через несколько секунд.</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-500">Ошибка авторизации</h1>
            <p>{errorMessage || "Произошла ошибка при авторизации. Пожалуйста, попробуйте снова."}</p>
          </>
        )}
      </div>
    </div>
  )
}
