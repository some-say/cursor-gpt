export interface CursorGptPathPoint {
  /** x coordinate in pixels */
  x: number
  /** y coordinate in pixels */
  y: number
}

export interface CursorGptPath {
  /** Coordinates at which the path should start. */
  start: CursorGptPathPoint
  /** Coordinates at which the path should end. */
  end: CursorGptPathPoint
  /** Duration of the path in milliseconds. */
  duration: number
}

export interface CursorGptPoint {
  /** x coordinate in pixels */
  x: number
  /** y coordinate in pixels */
  y: number
  /** Delta in ms since the preceding point. */
  deltaTime: number
}

export interface CursorGptMouseEvent extends CursorGptPoint {
  /** Auto-resolved timestamp in ms. */
  timestamp: number
}

export type CursorGptPromptName =
  | "init"
  | "task"
  | "response"
  | "constraints"
  | string

export interface CursorGptPrompt {
  /** Order in which the prompt should be provided to the API. */
  order: number
  /** Unique name identifier of the prompt. */
  name: CursorGptPromptName
  /** Content of the prompt as string. */
  content: string
}
