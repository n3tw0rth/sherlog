"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

type GameState = "waiting" | "ready" | "active" | "clicked" | "too-early"

export default function ReactionTimePage() {
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [attempts, setAttempts] = useState<number[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { user, updateScores } = useAuth()

  const startGame = () => {
    setGameState("ready")
    setReactionTime(null)

    // Random delay between 2-6 seconds
    const delay = Math.random() * 4000 + 2000

    timeoutRef.current = setTimeout(() => {
      setGameState("active")
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "ready") {
      // Clicked too early
      setGameState("too-early")
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    } else if (gameState === "active") {
      // Valid click
      const endTime = Date.now()
      const reaction = endTime - startTime
      setReactionTime(reaction)
      setGameState("clicked")
      setAttempts((prev) => [...prev, reaction])

      // Save score if user is logged in
      if (user) {
        updateScores("reactionTime", reaction)
      }
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const getButtonText = () => {
    switch (gameState) {
      case "waiting":
        return "Click to Start"
      case "ready":
        return "Wait for Red..."
      case "active":
        return "CLICK NOW!"
      case "clicked":
        return `${reactionTime}ms`
      case "too-early":
        return "Too Early!"
      default:
        return "Click to Start"
    }
  }

  const getButtonColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-primary hover:bg-primary/90 text-primary-foreground"
      case "ready":
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      case "active":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      case "clicked":
        return "bg-chart-1 hover:bg-chart-1/90 text-white"
      case "too-early":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground"
    }
  }

  const averageTime = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null

  const bestTime = attempts.length > 0 ? Math.min(...attempts) : null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary">
            ← ReactionGames
          </Link>
          {user && <span className="text-sm text-muted-foreground">{user.username}</span>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Reaction Time Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Click the button as soon as it turns red. Your reaction time will be measured in milliseconds.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <button
                  onClick={gameState === "waiting" ? startGame : handleClick}
                  disabled={gameState === "ready"}
                  className={`
                    w-64 h-64 rounded-full text-2xl font-bold transition-all duration-200 
                    ${getButtonColor()}
                    ${gameState === "ready" ? "cursor-wait" : "cursor-pointer"}
                    hover:scale-105 active:scale-95
                  `}
                >
                  {getButtonText()}
                </button>
              </div>

              {gameState === "ready" && (
                <p className="text-muted-foreground mb-4">
                  Wait for the button to turn red, then click as fast as you can!
                </p>
              )}

              {gameState === "too-early" && (
                <div className="mb-4">
                  <p className="text-destructive font-semibold mb-2">You clicked too early!</p>
                  <p className="text-muted-foreground">Wait for the button to turn red before clicking.</p>
                </div>
              )}

              {gameState === "clicked" && reactionTime && (
                <div className="mb-4">
                  <p className="text-2xl font-bold text-foreground mb-2">{reactionTime}ms</p>
                  <p className="text-muted-foreground">
                    {reactionTime < 200
                      ? "Excellent!"
                      : reactionTime < 300
                        ? "Good!"
                        : reactionTime < 400
                          ? "Average"
                          : "Keep practicing!"}
                  </p>
                </div>
              )}

              {(gameState === "clicked" || gameState === "too-early") && (
                <div className="flex gap-4 justify-center">
                  <Button onClick={startGame}>Try Again</Button>
                  <Button variant="outline" onClick={resetGame}>
                    Reset
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {attempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Track your progress and improve your reaction time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{attempts.length}</p>
                    <p className="text-sm text-muted-foreground">Attempts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-1">{bestTime}ms</p>
                    <p className="text-sm text-muted-foreground">Best Time</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{averageTime}ms</p>
                    <p className="text-sm text-muted-foreground">Average</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recent Attempts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {attempts.slice(-10).map((time, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                        {time}ms
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!user && attempts.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Sign in to save your scores and track your progress over time!
                </p>
                <Link href="/">
                  <Button variant="outline">Go Back to Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
