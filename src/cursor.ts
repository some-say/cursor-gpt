import { config as dotenv } from "dotenv"

import { createPathPrompt, getPathPrompts } from "./components/path"
import { parsePathResponse } from "./components/path/parsers"
import { Api, CursorGptConfigSchema } from "./support"
import type { CursorGptMouseEvent, CursorGptPath } from "./components/path"
import type { CursorGptConfig, CursorGptOptions, OpenAiModel } from "./types"

export class CursorGpt {
  /**
   * Configuration for instance.
   * Result of merging defaults, environment variables, and runtime config.
   *
   * @internal
   */
  readonly #config: CursorGptConfig

  /**
   * OpenAI API client instance.
   * Instantiates at construction.
   *
   * @internal
   */
  readonly #api: Api

  /**
   * Constructor.
   *
   * @param config - Runtime configuration.
   *
   * @public
   */
  public constructor(config: Partial<CursorGptConfig> = {}) {
    this.#config = this.#configure(config)
    this.#api = new Api(this.#config)
  }

  /**
   * Returns the current model in use.
   *
   * @public
   */
  public get model(): OpenAiModel {
    return this.#config.model
  }

  /**
   * Generates a natural mouse path between two points over a given duration.
   * Sends request to OpenAI API and returns an array of usable mouse events.
   *
   * @param path - Defines the path to complete.
   * @param timestampDelta - Offset to apply when calculating initial timestamp.
   * @param temperature - ChatGPT temperature parameter. Increasing this
   * value will increase the likelihood of more creative responses, but may
   * result in more errors.
   * @param dryRun - If true, will not send request to OpenAI API.
   *
   * @returns Array of mouse events, with positions and times.
   *
   * @public
   */
  public async completePath(
    path: CursorGptPath,
    { timestampDelta, temperature, dryRun = false }: CursorGptOptions = {}
  ): Promise<CursorGptMouseEvent[]> {
    const prompts: string[] = this.generatePathPrompts(path)

    if (dryRun) {
      console.warn("Dry run, not sending request to OpenAI.")
      console.debug(prompts)
      throw new Error(`Dry run halt requested.`)
    }

    const response: string = await this.#api.complete(prompts, temperature)

    return parsePathResponse(response, timestampDelta)
  }

  /**
   * Generates a natural series of scroll events over a given duration.
   * Important: Not yet implemented.
   *
   * @alpha
   *
   * @public
   */
  public async completeScroll(): Promise<void> {
    // TODO
  }

  /**
   * Generates prompts for path completion requests.
   * Available prompts are defined in `src/components/path/prompts.ts`.
   * Useful for debugging.
   *
   * @param path - Defines the path to complete.
   * @returns Array of prompts.
   *
   * @public
   */
  public generatePathPrompts(path: CursorGptPath): string[] {
    return [...getPathPrompts(), createPathPrompt(path)]
  }

  /**
   * Merges defaults, environment variables, and runtime config.
   * Runtime config takes precedence.
   *
   * @param config - Runtime configuration.
   *
   * @returns Merged configuration.
   *
   * @internal
   */
  #configure(config: Partial<CursorGptConfig>): CursorGptConfig {
    dotenv()

    const input: Partial<CursorGptConfig> = {
      apiKey: process.env.OPENAI_API_KEY || undefined,
      organization: process.env.OPENAI_ORGANIZATION || undefined,
      model: process.env.OPENAI_MODEL || undefined,
      ...config
    }

    return CursorGptConfigSchema.parse(input)
  }
}
