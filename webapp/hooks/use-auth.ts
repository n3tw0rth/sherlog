"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "./use-store"
import { GAME_TYPE } from "@/lib/types"

interface User {
  username: string
  scores: {
    reactionTime: number[]
    clickSpeed: number[]
  }
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const store = useAppStore()

  useEffect(() => {
    // Check if user is logged in on mount
    setIsLoading(false)
  }, [])

  const login = (username: string): boolean => {
    const users = store.users

    const score = {
      reactionTime: [],
      clickSpeed: [],
    }

    store.setActiveUser(username)
    store.addUser(username, score)

    return true
  }

  const logout = () => {
    store.reset()
  }

  const updateScores = (gameType: GAME_TYPE, score: number) => {
    if (!store.activeUser) return

    store.updateScore(store.activeUser, gameType, score)
  }

  return {
    isLoading,
    login,
    logout,
    updateScores,
    store
  }
}
