export type OpenAiModel = "gpt-3.5-turbo" | "gpt4" | string

export interface CursorGptConfig {
  apiKey: string
  organization: string
  model: OpenAiModel
  durationRange: [number, number]
}

export interface CursorGptOptions {
  timestampDelta?: number
  temperature?: number
  dryRun?: boolean
}
