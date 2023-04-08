export type OpenAiModel = "gpt-3.5-turbo" | "gpt-4" | string

/**
 * Main configuration object for instance.
 *
 * @public
 */
export interface CursorGptConfig {
  /** OpenAI API key */
  apiKey: string
  /** OpenAI organization */
  organization: string
  /** OpenAI model */
  model: OpenAiModel
}

/**
 * Supplementary options to adjust completion behavior.
 *
 * @public
 */
export interface CursorGptOptions {
  /** Buffer in milliseconds to add the first timestamp. */
  timestampDelta?: number
  /** Adjust the temperature of the model. Higher is more random. */
  temperature?: number
  /** Halt execution with an error before sending API request. */
  dryRun?: boolean
}
