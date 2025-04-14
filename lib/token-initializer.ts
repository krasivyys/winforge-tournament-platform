import { setAccessToken } from "./api"

/**
 * Инициализирует токен доступа при загрузке приложения
 * Эту функцию следует вызывать в компоненте верхнего уровня (например, в layout.tsx)
 */
export function initializeToken(): void {
  // Проверяем, что мы на клиенте
  if (typeof window === "undefined") {
    return
  }

  // Устанавливаем токен из localStorage, если он там есть
  const storedToken = localStorage.getItem("accessToken")
  if (storedToken) {
    console.log("Инициализация токена из localStorage")
    setAccessToken(storedToken)
    return
  }

  // Здесь можно добавить логику для получения токена из URL параметров,
  // если пользователь был перенаправлен после OAuth авторизации
  const params = new URLSearchParams(window.location.search)
  const tokenFromUrl = params.get("token")
  if (tokenFromUrl) {
    console.log("Инициализация токена из URL параметров")
    setAccessToken(tokenFromUrl)

    // Очищаем URL от параметра token
    const newUrl =
      window.location.pathname +
      (window.location.search ? window.location.search.replace(/[?&]token=[^&]+/, "") : "") +
      window.location.hash
    window.history.replaceState({}, document.title, newUrl)
  }
}

/**
 * Устанавливает предоставленный токен доступа
 * @param token JWT токен доступа
 */
export function setManualToken(token: string): void {
  setAccessToken(token)
}
