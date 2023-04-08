import { z } from "zod"

import type { CursorGptPoint } from "./types"

/**
 * Parses point objects from the ChatGPT response array.
 *
 * @internal
 */
export const CursorGptPointSchema: z.ZodType<CursorGptPoint> = z.object({
  x: z.number().describe(`X coordinate.`),
  y: z.number().describe(`Y coordinate.`),
  deltaTime: z.number().describe(`Time delta from preceding point.`)
})
