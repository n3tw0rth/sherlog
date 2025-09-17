"use client"

import { useState, useEffect } from "react"

interface User {
  username: string
  scores: {
    reactionTime: number[]
    clickSpeed: number[]
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem("gameUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (username: string, password: string): boolean => {
    // Simple localStorage-based auth
    const users = JSON.parse(localStorage.getItem("gameUsers") || "{}")

    if (users[username] && users[username].password === password) {
      const userData = {
        username,
        scores: users[username].scores || { reactionTime: [], clickSpeed: [] },
      }
      setUser(userData)
      localStorage.setItem("gameUser", JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = (username: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("gameUsers") || "{}")

    if (users[username]) {
      return false // User already exists
    }

    users[username] = {
      password,
      scores: { reactionTime: [], clickSpeed: [] },
    }

    localStorage.setItem("gameUsers", JSON.stringify(users))

    const userData = {
      username,
      scores: { reactionTime: [], clickSpeed: [] },
    }
    setUser(userData)
    localStorage.setItem("gameUser", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("gameUser")
  }

  const updateScores = (gameType: "reactionTime" | "clickSpeed", score: number) => {
    if (!user) return

    const updatedUser = {
      ...user,
      scores: {
        ...user.scores,
        [gameType]: [...user.scores[gameType], score],
      },
    }

    setUser(updatedUser)
    localStorage.setItem("gameUser", JSON.stringify(updatedUser))

    // Update in users database
    const users = JSON.parse(localStorage.getItem("gameUsers") || "{}")
    if (users[user.username]) {
      users[user.username].scores = updatedUser.scores
      localStorage.setItem("gameUsers", JSON.stringify(users))
    }
  }

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateScores,
  }
}
