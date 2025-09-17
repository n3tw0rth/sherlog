"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { GAME_TYPE } from "@/lib/types"
import { Header } from "@/components/header"
import { AuthModal } from "@/components/auth-modal"

type GameState = "waiting" | "countdown" | "active" | "finished"

export default function ClickSpeedPage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [gameState, setGameState] = useState<GameState>("waiting")
  const [clickCount, setClickCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [countdownTime, setCountdownTime] = useState(3)
  const [attempts, setAttempts] = useState<number[]>([])
  const [gameDuration, setGameDuration] = useState(10)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)
  const { store, updateScores } = useAuth()

  const startCountdown = () => {
    setGameState("countdown")
    setCountdownTime(3)
    setClickCount(0)
    setTimeLeft(gameDuration)

    countdownRef.current = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          startGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const startGame = () => {
    setGameState("active")
    setTimeLeft(gameDuration)

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const endGame = () => {
    setGameState("finished")
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setAttempts((prev) => [...prev, clickCount])

    // Save score if user is logged in
    if (store.activeUser) {
      updateScores(GAME_TYPE.CLICK_SPEED, clickCount)
    }
  }

  const handleClick = () => {
    if (gameState === "active") {
      setClickCount((prev) => prev + 1)
    }
  }

  const resetGame = () => {
    setGameState("waiting")
    setClickCount(0)
    setTimeLeft(gameDuration)
    setCountdownTime(3)

    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current)
      }
    }
  }, [])

  const getButtonText = () => {
    switch (gameState) {
      case "waiting":
        return "Start Test"
      case "countdown":
        return countdownTime.toString()
      case "active":
        return `${clickCount} clicks`
      case "finished":
        return `Final: ${clickCount}`
      default:
        return "Start Test"
    }
  }

  const getButtonColor = () => {
    switch (gameState) {
      case "waiting":
        return "bg-primary hover:bg-primary/90 text-primary-foreground"
      case "countdown":
        return "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
      case "active":
        return "bg-chart-1 hover:bg-chart-1/90 text-white active:bg-chart-2"
      case "finished":
        return "bg-accent hover:bg-accent/90 text-accent-foreground"
      default:
        return "bg-primary hover:bg-primary/90 text-primary-foreground"
    }
  }

  const averageClicks =
    attempts.length > 0 ? Math.round((attempts.reduce((a, b) => a + b, 0) / attempts.length) * 10) / 10 : null

  const bestScore = attempts.length > 0 ? Math.max(...attempts) : null
  const cps =
    gameState === "active" || gameState === "finished"
      ? Math.round((clickCount / (gameDuration - timeLeft)) * 10) / 10
      : null

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setShowAuthModal(true)} />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Click Speed Test</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Click the button as fast as you can within the time limit. Challenge your clicking speed!
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-12 text-center">
              <div className="mb-8">
                <button
                  onClick={gameState === "waiting" ? startCountdown : handleClick}
                  disabled={gameState === "countdown"}
                  className={`
                    w-64 h-64 rounded-full text-2xl font-bold transition-all duration-100 
                    ${getButtonColor()}
                    ${gameState === "countdown" ? "cursor-wait" : "cursor-pointer"}
                    ${gameState === "active" ? "hover:scale-105 active:scale-95" : ""}
                    select-none
                  `}
                >
                  {getButtonText()}
                </button>
              </div>

              {gameState === "active" && (
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground mb-2">{timeLeft}s</p>
                  <p className="text-muted-foreground">Keep clicking! {cps && `${cps} clicks/sec`}</p>
                </div>
              )}

              {gameState === "countdown" && (
                <p className="text-muted-foreground mb-4">Get ready to click as fast as you can!</p>
              )}

              {gameState === "finished" && (
                <div className="mb-4">
                  <p className="text-3xl font-bold text-foreground mb-2">{clickCount} clicks</p>
                  <p className="text-lg text-muted-foreground mb-2">{cps} clicks per second</p>
                  <p className="text-muted-foreground">
                    {clickCount >= 80
                      ? "Lightning fast!"
                      : clickCount >= 60
                        ? "Excellent!"
                        : clickCount >= 40
                          ? "Good job!"
                          : clickCount >= 20
                            ? "Not bad!"
                            : "Keep practicing!"}
                  </p>
                </div>
              )}

              {gameState === "finished" && (
                <div className="flex gap-4 justify-center">
                  <Button onClick={startCountdown}>Try Again</Button>
                  <Button variant="outline" onClick={resetGame}>
                    Change Settings
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {attempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Your Statistics</CardTitle>
                <CardDescription>Track your clicking speed progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{attempts.length}</p>
                    <p className="text-sm text-muted-foreground">Attempts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-chart-1">{bestScore}</p>
                    <p className="text-sm text-muted-foreground">Best Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{averageClicks}</p>
                    <p className="text-sm text-muted-foreground">Average</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Recent Attempts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {attempts.slice(-10).map((score, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                        {score} clicks
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!store.activeUser && attempts.length > 0 && (
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

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
