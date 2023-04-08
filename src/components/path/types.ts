export interface CursorGptPathPoint {
  x: number
  y: number
}

export interface CursorGptPath {
  start: CursorGptPathPoint
  end: CursorGptPathPoint
  duration: number
}

export interface CursorGptPoint {
  x: number
  y: number
  deltaTime: number
}

export interface CursorGptMouseEvent extends CursorGptPoint {
  timestamp: number
}

export type CursorGptPromptName =
  | "init"
  | "task"
  | "response"
  | "constraints"
  | string

export interface CursorGptPrompt {
  order: number
  name: CursorGptPromptName
  content: string
}
