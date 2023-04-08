import { z } from "zod"

import type { CursorGptPoint } from "./types"

export const CursorGptPointSchema: z.ZodType<CursorGptPoint> = z.object({
  x: z.number().describe(`X coordinate.`),
  y: z.number().describe(`Y coordinate.`),
  deltaTime: z.number().describe(`Time delta.`)
})
