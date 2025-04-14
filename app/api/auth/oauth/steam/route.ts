import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Перенаправляем запрос на реальный API
    const response = await fetch("https://api.winforge.ru/v1/auth/oauth/steam", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.message || "Ошибка при получении URL для авторизации Steam" },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Ошибка при запросе к Steam OAuth:", error)
    return NextResponse.json({ error: "Не удалось выполнить запрос к серверу авторизации" }, { status: 500 })
  }
}
