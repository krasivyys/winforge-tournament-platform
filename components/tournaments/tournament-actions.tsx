"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/auth-context"
import { joinTournament, leaveTournament, generateTournamentBracket } from "@/lib/api/tournaments"
import { useRouter } from "next/navigation"

interface TournamentActionsProps {
  tournamentId: string
  status: string
}

export default function TournamentActions({ tournamentId, status }: TournamentActionsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleJoin = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to join this tournament.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await joinTournament(tournamentId)
      toast({
        title: "Success",
        description: "You have successfully joined the tournament.",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Failed to join",
        description: error.message || "An error occurred while joining the tournament.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeave = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await leaveTournament(tournamentId)
      toast({
        title: "Success",
        description: "You have left the tournament.",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Failed to leave",
        description: error.message || "An error occurred while leaving the tournament.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateBracket = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      await generateTournamentBracket(tournamentId)
      toast({
        title: "Success",
        description: "Tournament bracket has been generated.",
      })
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Failed to generate bracket",
        description: error.message || "An error occurred while generating the bracket.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "registration" && (
          <>
            <Button className="w-full" onClick={handleJoin} disabled={isLoading || !user}>
              Join Tournament
            </Button>
            <Button variant="outline" className="w-full" onClick={handleLeave} disabled={isLoading || !user}>
              Leave Tournament
            </Button>
          </>
        )}

        {user?.role === "admin" && status === "registration" && (
          <Button variant="secondary" className="w-full" onClick={handleGenerateBracket} disabled={isLoading}>
            Generate Bracket
          </Button>
        )}

        {!user && (
          <p className="text-sm text-muted-foreground text-center">Please log in to participate in this tournament.</p>
        )}
      </CardContent>
    </Card>
  )
}
