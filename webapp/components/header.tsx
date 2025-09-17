"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface HeaderProps {
  onAuthClick: () => void
}

export function Header({ onAuthClick }: HeaderProps) {
  const { store, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.replace("/")
  }

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <h1 className="text-xl font-extrabold text-foreground leading-none">|2Big<br />|Buttons</h1>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {store.activeUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {store.activeUser}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
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
