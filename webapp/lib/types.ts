export enum GAME_TYPE {
  REACTION_TIME = "reactionTime",
  CLICK_SPEED = "clickSpeed",
}

export interface Scores {
  reactionTime: number[]
  clickSpeed: number[]
}

export interface AppState {
  activeUser: string | null,
  users: { [username: string]: Scores }
}

export interface AppActions {
  addUser: (username: string, scores: Scores) => void
  getUser: (username: string) => Scores
  setActiveUser: (username: string) => void
  updateScore: (username: string, gameType: GAME_TYPE, score: number) => void,
  reset: () => void
}

export type AppStore = AppState & AppActions;
