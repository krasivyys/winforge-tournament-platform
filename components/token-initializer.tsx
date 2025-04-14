"use client"

import { useEffect } from "react"
import { setManualToken } from "@/lib/token-initializer"

interface TokenInitializerProps {
  token?: string
}

/**
 * Компонент для инициализации токена доступа
 * Можно использовать в layout.tsx или на странице входа
 */
export function TokenInitializer({ token }: TokenInitializerProps) {
  useEffect(() => {
    if (token) {
      console.log("Устанавливаем предоставленный токен")
      setManualToken(token)
    }
  }, [token])

  // Компонент не рендерит ничего видимого
  return null
}
