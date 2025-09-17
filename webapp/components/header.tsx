"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface HeaderProps {
  onAuthClick: () => void
}

export function Header({ onAuthClick }: HeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-foreground">ReactionGames</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onAuthClick}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
