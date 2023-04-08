import { z, ZodError } from "zod"

import { CursorGptPointSchema } from "./schemas"
import type { CursorGptMouseEvent } from "./types"

export const parsePathResponse = (
  response: string,
  timestampDelta: number = 0
): CursorGptMouseEvent[] => {
  try {
    const points: CursorGptMouseEvent[] = z
      .array(CursorGptPointSchema)
      .parse(JSON.parse(response.trim()))
      .map((point) => ({ ...point, timestamp: 0 }))

    points.forEach((point, i) => {
      if (i === 0) {
        point.timestamp = Date.now() + timestampDelta
      } else {
        point.timestamp = points[i - 1].timestamp + points[i].deltaTime
      }
    })

    return points
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error(
        `ChatGPT response failed schema validation: ${error.message}`
      )
    } else {
      throw new Error(`Failed to parse GPT response: ${error.message}`)
    }
  }
}
