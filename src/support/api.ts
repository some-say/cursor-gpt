import { Configuration, OpenAIApi } from "openai"
import { ChatCompletionRequestMessageRoleEnum } from "openai/api"

import { nonNullable } from "./utils"
import type { CursorGptConfig } from "../types"

/**
 * OpenAI API client wrapper.
 *
 * @public
 */
export class Api {
  /**
   * GPT model to use.
   *
   * @see https://beta.openai.com/docs/api-reference/models
   * @example "gpt-3.5-turbo"
   *
   * @public
   */
  public readonly model: string

  /**
   * Initialized OpenAI API client.
   *
   * @internal
   */
  readonly #api: OpenAIApi

  /**
   * Default temperature to use in completion requests.
   *
   * @internal
   */
  readonly #defaultTemperature: number

  /**
   * One-time check if the model is available and ready to use.
   *
   * @internal
   */
  #ready: boolean = false

  public constructor({
    apiKey,
    organization,
    model,
    defaultTemperature = 0.2
  }: Pick<
    CursorGptConfig,
    "apiKey" | "organization" | "model" | "defaultTemperature"
  >) {
    this.model = model
    this.#defaultTemperature = defaultTemperature
    this.#api = new OpenAIApi(new Configuration({ apiKey, organization }))
  }

  /**
   * Tests if the model is available and ready to use.
   *
   * @returns Boolean indicating if the model is ready.
   *
   * @public
   */
  public async hasModel(): Promise<boolean> {
    const { data, status } = await this.#api.listModels()
    if (status !== 200) {
      this.#handleError(status)
    }

    return !!data.data.find((engine) => engine.id === this.model)
  }

  /**
   * Sends a request to the OpenAI API to complete a chat.
   *
   * @param prompts - Array of strings to use as prompts.
   * @param temperature - ChatGPT temperature.
   *
   * @returns String of the completed prompt.
   *
   * @public
   */
  public async complete(
    prompts: string[],
    temperature: number = this.#defaultTemperature
  ): Promise<string> {
    // Do not continue if model is not available.
    await this.#guardModel()

    const { data, status } = await this.#api.createChatCompletion({
      model: this.model,
      temperature,
      messages: prompts.map((content) => ({
        role: ChatCompletionRequestMessageRoleEnum.User,
        content
      }))
    })

    if (status !== 200) {
      this.#handleError(status, `Failed to complete prompt.`)
    }

    return nonNullable(data.choices[0].message?.content, `No responses.`)
  }

  /**
   * Sends a request to the OpenAI API to ensure user has access to the model.
   *
   * @throws Error if model is not available.
   *
   * @internal
   */
  async #guardModel(): Promise<void> {
    if (this.#ready) {
      return
    }

    const hasModel: boolean = await this.hasModel()

    if (!hasModel) {
      throw new Error(`Model ${this.model} not available on your account.`)
    }

    this.#ready = true
  }

  /**
   * Handles errors from OpenAI API http client.
   *
   * @param status - HTTP status code.
   * @param message - Optional message to append to error.
   *
   * @throws Error with status code and message.
   *
   * @internal
   */
  #handleError(
    status: number,
    message: string = "OpenAI request failed."
  ): never {
    // TODO: Write useful / descriptive error messages.
    const errors = new Map([
      [401, "Unauthorized"],
      [404, "Not found"],
      [429, "Too many requests"],
      [500, "Internal server error"],
      [503, "Service unavailable"],
      [504, "Gateway timeout"],
      [522, "Connection timed out"]
    ])

    const error = errors.get(status) ?? "Unknown error"

    throw new Error(`${status}: ${message} ${error}`.trim())
  }
}
