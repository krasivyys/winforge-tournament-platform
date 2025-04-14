"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { TournamentBracket } from "@/lib/types"

interface TournamentBracketViewProps {
  bracket: TournamentBracket
}

export default function TournamentBracketView({ bracket }: TournamentBracketViewProps) {
  return (
    <Card>
      <CardContent className="pt-6 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex justify-between">
            {bracket.rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="flex flex-col gap-4 min-w-[200px]">
                <h3 className="text-center font-medium">
                  {round.round_number === 1
                    ? "Round 1"
                    : round.round_number === bracket.rounds.length
                      ? "Final"
                      : `Round ${round.round_number}`}
                </h3>
                <div className="flex flex-col gap-6">
                  {round.matches.map((match, matchIndex) => (
                    <div key={matchIndex} className="border rounded-md p-3 bg-card">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate max-w-[120px]">{match.participant1_name || "TBD"}</span>
                          <span className="text-sm">
                            {match.participant1_score !== undefined ? match.participant1_score : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium truncate max-w-[120px]">{match.participant2_name || "TBD"}</span>
                          <span className="text-sm">
                            {match.participant2_score !== undefined ? match.participant2_score : "-"}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {match.status === "completed"
                            ? "Completed"
                            : match.status === "in_progress"
                              ? "In Progress"
                              : match.scheduled_time
                                ? `Scheduled: ${new Date(match.scheduled_time).toLocaleString()}`
                                : "Pending"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
