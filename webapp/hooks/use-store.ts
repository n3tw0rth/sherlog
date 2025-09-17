import { constants } from '@/lib/constants'
import { AppState, AppStore, GAME_TYPE, Scores } from '@/lib/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const defaultState: AppState = {
  activeUser: null,
  users: {},
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get, store) => ({
      ...defaultState,
      addUser: (username: string, scores: Scores) => set({ users: { ...get().users, [username]: scores } }),
      getUser: (username: string) => get().users[username],
      setActiveUser: (username: string) => set({ activeUser: username }),
      updateScore: (username: string, gameType: GAME_TYPE, score: number) => set({
        users: {
          ...get().users,
          [username]: {
            ...get().users[username],
            [gameType]: [...get().users[username][gameType], score],
          },
        },
      }),
      reset: () => {
        set(store.getInitialState())
      },
    }),
    {
      name: constants.storeName,
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
