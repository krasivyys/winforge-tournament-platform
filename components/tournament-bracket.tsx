"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface Match {
  id: string
  round: number
  player1_id: string | null
  player2_id: string | null
  winner_id: string | null
  status: string
}

interface Bracket {
  tournament_id: string
  matches: Match[]
}

export default function TournamentBracket({ tournamentId }: { tournamentId: string }) {
  const [bracket, setBracket] = useState<Bracket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBracket = async () => {
      try {
        const response = await fetch(`/api/v1/tournaments/${tournamentId}/bracket`)
        if (response.ok) {
          const data = await response.json()
          setBracket(data)
        } else {
          setError("Не удалось загрузить сетку турнира")
        }
      } catch (error) {
        console.error("Ошибка при загрузке сетки:", error)
        setError("Произошла ошибка при загрузке сетки турнира")
      } finally {
        setLoading(false)
      }
    }

    fetchBracket()
  }, [tournamentId])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (!bracket || !bracket.matches || bracket.matches.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Сетка турнира пока недоступна</p>
      </div>
    )
  }

  // Группируем матчи по раундам
  const matchesByRound: { [key: number]: Match[] } = {}
  bracket.matches.forEach((match) => {
    if (!matchesByRound[match.round]) {
      matchesByRound[match.round] = []
    }
    matchesByRound[match.round].push(match)
  })

  const rounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b)

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-8 min-w-[800px] p-4">
        {rounds.map((round) => (
          <div key={round} className="flex-1">
            <h3 className="text-center font-medium mb-4">
              {round === 1
                ? "Раунд 1"
                : round === 2
                  ? "Четвертьфинал"
                  : round === 3
                    ? "Полуфинал"
                    : round === 4
                      ? "Финал"
                      : `Раунд ${round}`}
            </h3>
            <div className="space-y-8">
              {matchesByRound[round].map((match) => (
                <Card key={match.id} className="overflow-hidden border-gray-800 bg-gray-900/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className={`p-2 rounded ${match.winner_id === match.player1_id ? "bg-green-900/30" : ""}`}>
                        {match.player1_id ? `Игрок/Команда ${match.player1_id.substring(0, 8)}` : "TBD"}
                      </div>
                      <div className="text-center text-xs text-gray-400">VS</div>
                      <div className={`p-2 rounded ${match.winner_id === match.player2_id ? "bg-green-900/30" : ""}`}>
                        {match.player2_id ? `Игрок/Команда ${match.player2_id.substring(0, 8)}` : "TBD"}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-center text-gray-400">
                      {match.status === "completed" ? "Завершен" : "Ожидается"}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
