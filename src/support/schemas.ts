import { z } from "zod"

import type { CursorGptConfig } from "../types"

/**
 * Zod schema representing the CursorGPT configuration object.
 *
 * @public
 */
export const CursorGptConfigSchema: z.ZodType<CursorGptConfig> = z.object({
  apiKey: z
    .string()
    .describe(
      `OpenAI api key. You can get one from https://beta.openai.com/account/api-keys.`
    ),
  organization: z.string().describe(`OpenAI organization id.`),
  model: z.string().describe(`GPT model to use.`),
  durationRange: z
    .tuple([z.number(), z.number()])
    .describe(`Minimum and maximum duration range to randomize.`)
})
