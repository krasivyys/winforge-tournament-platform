/**
 * Базовая конфигурация и утилиты для работы с API Winforge
 */

// Базовый URL API
export const API_BASE_URL = "https://api.winforge.ru/v1"

// Типы запросов
type RequestMethod = "GET" | "POST" | "PUT" | "DELETE"

// Интерфейс для опций запроса
interface RequestOptions {
  method?: RequestMethod
  headers?: Record<string, string>
  body?: any
  requiresAuth?: boolean
}

// Добавим функцию для установки токена доступа вручную
export function setAccessToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token)
    console.log("Токен доступа установлен вручную")
  }
}

// Добавим функцию для получения текущего токена
export function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

/**
 * Выполняет запрос к API
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers = {}, body, requiresAuth = true } = options

  // Формируем URL
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`

  // Базовые заголовки
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  }

  // Добавляем токен авторизации, если требуется
  if (requiresAuth) {
    const accessToken = getAccessToken()
    if (accessToken) {
      requestHeaders["Authorization"] = `Bearer ${accessToken}`
    }
  }

  // Опции запроса
  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include", // Включаем куки для кросс-доменных запросов
    mode: "cors", // Явно указываем режим CORS
  }

  // Добавляем тело запроса для не-GET запросов
  if (body && method !== "GET") {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    console.log(`Выполняем запрос к: ${url}`, requestOptions)
    const response = await fetch(url, requestOptions)
    console.log(`Получен ответ:`, response)

    // Проверяем статус ответа
    if (!response.ok) {
      // Пытаемся получить детали ошибки из ответа
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { message: "Неизвестная ошибка" }
      }

      // Если получили 401, возможно, токен истек
      if (response.status === 401) {
        // Пытаемся обновить токен
        const refreshed = await refreshTokenAndRetry()
        if (refreshed) {
          // Повторяем запрос с новым токеном
          return apiRequest(endpoint, options)
        }
      }

      throw new Error(errorData.message || `Ошибка запроса: ${response.status}`)
    }

    // Для запросов, которые не возвращают JSON (например, DELETE)
    if (response.status === 204) {
      return {} as T
    }

    // Парсим JSON ответ
    const data = await response.json()
    return data as T
  } catch (error) {
    console.error("API request error:", error)
    throw error
  }
}

/**
 * Пытается обновить токен доступа
 */
async function refreshTokenAndRetry(): Promise<boolean> {
  const refreshToken = localStorage.getItem("refreshToken")

  if (!refreshToken) {
    // Если нет токена обновления, выходим из аккаунта
    localStorage.removeItem("accessToken")
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
      credentials: "include",
      mode: "cors",
    })

    if (!response.ok) {
      // Если не удалось обновить токен, выходим из аккаунта
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      return false
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.access_token)
    localStorage.setItem("refreshToken", data.refresh_token)
    return true
  } catch (error) {
    console.error("Token refresh error:", error)
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    return false
  }
}

/**
 * API для работы с аутентификацией
 */
export const authApi = {
  // Вход по email и паролю
  login: (email: string, password: string) =>
    apiRequest<{ access_token: string; refresh_token: string }>("/auth/login", {
      method: "POST",
      body: { email, password },
      requiresAuth: false,
    }),

  // Регистрация нового пользователя
  register: (username: string, email: string, password: string) =>
    apiRequest<{ access_token: string; refresh_token: string }>("/auth/register", {
      method: "POST",
      body: { username, email, password },
      requiresAuth: false,
    }),

  // Выход из системы
  logout: () =>
    apiRequest<void>("/auth/logout", {
      method: "POST",
    }),

  // Получение данных текущего пользователя
  getCurrentUser: () => apiRequest<any>("/users/me"),

  // Обновление токена
  refreshToken: (refreshToken: string) =>
    apiRequest<{ access_token: string; refresh_token: string }>("/auth/refresh", {
      method: "POST",
      body: { refresh_token: refreshToken },
      requiresAuth: false,
    }),

  // Получение URL для OAuth авторизации
  getOAuthUrl: (provider: string) => {
    // Для OAuth авторизации мы не делаем запрос к API, а просто формируем URL
    // Это позволяет избежать проблем с CORS
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)

    if (provider === "steam") {
      return Promise.resolve({
        url: `${API_BASE_URL}/auth/oauth/steam?redirect_uri=${redirectUri}`,
      })
    } else if (provider === "discord") {
      return Promise.resolve({
        url: `${API_BASE_URL}/auth/oauth/discord?redirect_uri=${redirectUri}`,
      })
    } else {
      return Promise.reject(new Error(`Неподдерживаемый провайдер OAuth: ${provider}`))
    }
  },

  // Обработка OAuth callback
  handleOAuthCallback: (provider: string, code: string) =>
    apiRequest<{ access_token: string; refresh_token: string }>(`/auth/oauth/${provider}/callback`, {
      method: "POST",
      body: { code },
      requiresAuth: false,
    }),
}

/**
 * API для работы с турнирами
 */
export const tournamentsApi = {
  // Получение списка всех турниров
  getAll: () =>
    apiRequest<any[]>("/tournaments", {
      requiresAuth: false,
    }),

  // Получение конкретного турнира по ID
  getById: (id: string) =>
    apiRequest<any>(`/tournaments/${id}`, {
      requiresAuth: false,
    }),

  // Получение предстоящих турниров
  getUpcoming: () =>
    apiRequest<any[]>("/tournaments?status=upcoming", {
      requiresAuth: false,
    }),

  // Регистрация на турнир
  joinTournament: (id: string) =>
    apiRequest<any>(`/tournaments/${id}/join`, {
      method: "POST",
    }),

  // Отмена регистрации на турнир
  leaveTournament: (id: string) =>
    apiRequest<void>(`/tournaments/${id}/leave`, {
      method: "DELETE",
    }),

  // Получение сетки турнира
  getBracket: (id: string) =>
    apiRequest<any>(`/tournaments/${id}/bracket`, {
      requiresAuth: false,
    }),

  // Создание нового турнира
  create: (tournamentData: any) =>
    apiRequest<any>("/tournaments", {
      method: "POST",
      body: tournamentData,
    }),
}

/**
 * API для работы с командами
 */
export const teamsApi = {
  // Получение списка всех команд
  getAll: () =>
    apiRequest<any[]>("/teams", {
      requiresAuth: false,
    }),

  // Получение конкретной команды по ID
  getById: (id: string) =>
    apiRequest<any>(`/teams/${id}`, {
      requiresAuth: false,
    }),

  // Получение команд пользователя
  getUserTeams: () => apiRequest<any[]>("/teams/my"),

  // Создание новой команды
  create: (teamData: any) =>
    apiRequest<any>("/teams", {
      method: "POST",
      body: teamData,
    }),

  // Обновление команды
  update: (id: string, teamData: any) =>
    apiRequest<any>(`/teams/${id}`, {
      method: "PUT",
      body: teamData,
    }),

  // Удаление команды
  delete: (id: string) =>
    apiRequest<void>(`/teams/${id}`, {
      method: "DELETE",
    }),
}

/**
 * API для работы с пользователями
 */
export const usersApi = {
  // Получение профиля пользователя
  getProfile: () => apiRequest<any>("/users/me"),

  // Обновление профиля пользователя
  updateProfile: (userData: any) =>
    apiRequest<any>("/users/me", {
      method: "PUT",
      body: userData,
    }),

  // Получение статистики пользователя
  getStats: () => apiRequest<any>("/users/me/stats"),
}

/**
 * API для работы с матчами
 */
export const matchesApi = {
  // Получение списка всех матчей
  getAll: () =>
    apiRequest<any[]>("/matches", {
      requiresAuth: false,
    }),

  // Получение конкретного матча по ID
  getById: (id: string) =>
    apiRequest<any>(`/matches/${id}`, {
      requiresAuth: false,
    }),

  // Обновление результата матча
  updateResult: (id: string, resultData: any) =>
    apiRequest<any>(`/matches/${id}/result`, {
      method: "PUT",
      body: resultData,
    }),
}

/**
 * API для работы с рейтингами
 */
export const leaderboardApi = {
  // Получение общего рейтинга игроков
  getGlobal: () =>
    apiRequest<any[]>("/leaderboard", {
      requiresAuth: false,
    }),

  // Получение рейтинга по конкретной игре
  getByGame: (game: string) =>
    apiRequest<any[]>(`/leaderboard/${game}`, {
      requiresAuth: false,
    }),
}

/**
 * API для работы с уведомлениями
 */
export const notificationsApi = {
  // Получение списка уведомлений
  getAll: () => apiRequest<any[]>("/notifications"),

  // Отметить уведомление как прочитанное
  markAsRead: (id: string) =>
    apiRequest<void>(`/notifications/read/${id}`, {
      method: "POST",
    }),
}

/**
 * API для работы с подписками
 */
export const subscriptionsApi = {
  // Получение доступных подписок
  getAvailable: () =>
    apiRequest<any[]>("/subscriptions", {
      requiresAuth: false,
    }),

  // Оформление подписки
  purchase: (subscriptionData: any) =>
    apiRequest<any>("/subscriptions/buy", {
      method: "POST",
      body: subscriptionData,
    }),

  // Получение текущего статуса подписки
  getStatus: () => apiRequest<any>("/subscriptions/status"),
}

/**
 * API для работы с платежами
 */
export const paymentsApi = {
  // Запрос на вывод средств
  withdraw: (withdrawData: any) =>
    apiRequest<any>("/payments/withdraw", {
      method: "POST",
      body: withdrawData,
    }),

  // Оплата участия в турнире
  payTournament: (tournamentId: string, paymentData: any) =>
    apiRequest<any>(`/tournaments/${tournamentId}/pay`, {
      method: "POST",
      body: paymentData,
    }),
}
