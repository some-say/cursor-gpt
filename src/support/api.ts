import { Configuration, OpenAIApi } from "openai"
import { ChatCompletionRequestMessageRoleEnum } from "openai/api"

import { nonNullable } from "./utils"
import type { CursorGptConfig } from "../types"

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
   * One-time check if the model is available and ready to use.
   *
   * @internal
   */
  #ready: boolean = false

  public constructor({
    apiKey,
    organization,
    model
  }: Pick<CursorGptConfig, "apiKey" | "organization" | "model">) {
    this.model = model
    this.#api = new OpenAIApi(new Configuration({ apiKey, organization }))
  }

  public async hasModel(): Promise<boolean> {
    const { data, status } = await this.#api.listModels()
    if (status !== 200) {
      this.#handleError(status)
    }

    return !!data.data.find((engine) => engine.id === this.model)
  }

  public async complete(
    prompts: string[],
    temperature: number = 0.1
  ): Promise<string> {
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
