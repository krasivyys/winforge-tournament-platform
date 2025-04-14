export function getAuthHeader(): { Authorization: string } | Record<string, never> {
  if (typeof window === "undefined") return {}

  const token = localStorage.getItem("accessToken")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function handleApiError(error: any): string {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const data = error.response.data
    if (data && data.detail) {
      return data.detail
    }
    return `Error ${error.response.status}: ${error.response.statusText}`
  } else if (error.request) {
    // The request was made but no response was received
    return "No response received from server. Please check your connection."
  } else {
    // Something happened in setting up the request that triggered an Error
    return error.message || "An unknown error occurred"
  }
}
