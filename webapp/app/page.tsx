"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { store, isLoading } = useAuth()

  useEffect(() => {
    if (store.activeUser) {
    }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onAuthClick={() => setShowAuthModal(true)} />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Test Your Reflexes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Challenge yourself with our minimalistic reaction games. Measure your response time and clicking speed with
            precision.
          </p>
        </div>

        {store.activeUser && (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Reaction Time Test</CardTitle>
                <CardDescription>
                  Click the button as soon as it turns red. Test your reflexes and reaction speed.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/reaction-time">
                  <Button size="lg" className="w-full">
                    Start Reaction Test
                  </Button>
                </Link>
                {store.activeUser && store.getUser(store.activeUser).reactionTime.length > 0 && (
                  <p className="mt-4 text-sm text-muted-foreground">Best: {Math.min(...store.getUser(store.activeUser).reactionTime)}ms</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Click Speed Test</CardTitle>
                <CardDescription>
                  Click as fast as you can within the time limit. Challenge your clicking speed.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Link href="/click-speed">
                  <Button size="lg" className="w-full">
                    Start Speed Test
                  </Button>
                </Link>
                {store.activeUser && store.getUser(store.activeUser).reactionTime.length > 0 && (
                  <p className="mt-4 text-sm text-muted-foreground">Best: {Math.min(...store.getUser(store.activeUser).clickSpeed)} clicks</p>
                )}
              </CardContent>
            </Card>
          </div>)
        }

        {store.activeUser && (
          <div className="text-center mb-12">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-2">Track Your Progress</h3>
                <p className="text-muted-foreground mb-4">
                  View your statistics and see how you're improving over time.
                </p>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}

        {!store.activeUser && (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please Sign in first</p>
            <Button variant="outline" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
          </div>
        )}
      </main>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  )
}
