"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    redirect("/")
  }

  const reactionStats = {
    total: user.scores.reactionTime.length,
    best: user.scores.reactionTime.length > 0 ? Math.min(...user.scores.reactionTime) : null,
    average:
      user.scores.reactionTime.length > 0
        ? Math.round(user.scores.reactionTime.reduce((a, b) => a + b, 0) / user.scores.reactionTime.length)
        : null,
    recent: user.scores.reactionTime.slice(-5),
  }

  const clickStats = {
    total: user.scores.clickSpeed.length,
    best: user.scores.clickSpeed.length > 0 ? Math.max(...user.scores.clickSpeed) : null,
    average:
      user.scores.clickSpeed.length > 0
        ? Math.round((user.scores.clickSpeed.reduce((a, b) => a + b, 0) / user.scores.clickSpeed.length) * 10) / 10
        : null,
    recent: user.scores.clickSpeed.slice(-5),
  }

  const getReactionRating = (time: number) => {
    if (time < 200) return { text: "Excellent", color: "text-chart-1" }
    if (time < 300) return { text: "Good", color: "text-chart-2" }
    if (time < 400) return { text: "Average", color: "text-chart-3" }
    return { text: "Needs Practice", color: "text-chart-4" }
  }

  const getClickRating = (clicks: number) => {
    if (clicks >= 80) return { text: "Lightning Fast", color: "text-chart-1" }
    if (clicks >= 60) return { text: "Excellent", color: "text-chart-2" }
    if (clicks >= 40) return { text: "Good", color: "text-chart-3" }
    if (clicks >= 20) return { text: "Average", color: "text-chart-4" }
    return { text: "Keep Practicing", color: "text-chart-5" }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-foreground hover:text-primary">
            ← ReactionGames
          </Link>
          <span className="text-sm text-muted-foreground">{user.username}</span>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Dashboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Track your progress and see how your reflexes improve over time.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Reaction Time Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Reaction Time
                  <Link href="/reaction-time">
                    <Button variant="outline" size="sm">
                      Play Now
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Your reaction time performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {reactionStats.total > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{reactionStats.total}</p>
                        <p className="text-sm text-muted-foreground">Tests</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-chart-1">{reactionStats.best}ms</p>
                        <p className="text-sm text-muted-foreground">Best</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{reactionStats.average}ms</p>
                        <p className="text-sm text-muted-foreground">Average</p>
                      </div>
                    </div>

                    {reactionStats.best && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Your Rating:</p>
                        <p className={`font-semibold ${getReactionRating(reactionStats.best).color}`}>
                          {getReactionRating(reactionStats.best).text}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Recent Results:</h4>
                      <div className="flex flex-wrap gap-2">
                        {reactionStats.recent.map((time, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                            {time}ms
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No reaction time tests completed yet.</p>
                    <Link href="/reaction-time">
                      <Button>Take Your First Test</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Click Speed Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Click Speed
                  <Link href="/click-speed">
                    <Button variant="outline" size="sm">
                      Play Now
                    </Button>
                  </Link>
                </CardTitle>
                <CardDescription>Your clicking speed performance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                {clickStats.total > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">{clickStats.total}</p>
                        <p className="text-sm text-muted-foreground">Tests</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-chart-1">{clickStats.best}</p>
                        <p className="text-sm text-muted-foreground">Best</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">{clickStats.average}</p>
                        <p className="text-sm text-muted-foreground">Average</p>
                      </div>
                    </div>

                    {clickStats.best && (
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground mb-1">Your Rating:</p>
                        <p className={`font-semibold ${getClickRating(clickStats.best).color}`}>
                          {getClickRating(clickStats.best).text}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="font-semibold mb-2">Recent Results:</h4>
                      <div className="flex flex-wrap gap-2">
                        {clickStats.recent.map((clicks, index) => (
                          <span key={index} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                            {clicks} clicks
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No click speed tests completed yet.</p>
                    <Link href="/click-speed">
                      <Button>Take Your First Test</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Overall Progress</CardTitle>
              <CardDescription>Your gaming journey and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-foreground">{reactionStats.total + clickStats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Games</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-chart-1">
                    {reactionStats.best ? `${reactionStats.best}ms` : "-"}
                  </p>
                  <p className="text-sm text-muted-foreground">Fastest Reaction</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-chart-2">{clickStats.best ? `${clickStats.best}` : "-"}</p>
                  <p className="text-sm text-muted-foreground">Most Clicks</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {Math.max(reactionStats.total, clickStats.total) > 0
                      ? Math.round(((reactionStats.total + clickStats.total) / 2) * 10) / 10
                      : 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg per Game</p>
                </div>
              </div>

              {(reactionStats.total > 0 || clickStats.total > 0) && (
                <div className="mt-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    Keep practicing to improve your reflexes and reaction times!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href="/reaction-time">
                      <Button variant="outline">Practice Reactions</Button>
                    </Link>
                    <Link href="/click-speed">
                      <Button variant="outline">Practice Clicking</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
