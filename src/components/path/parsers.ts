import { z, ZodError } from "zod"

import { CursorGptPointSchema } from "./schemas"
import type { CursorGptPoint } from "./types"

/**
 * Parses the ChatGPT string response into a list of valid points.
 *
 * @param response - ChatGPT response string.
 * @param timestampDelta - Delta in ms to add to the first point's timestamp.
 *
 * @returns List of parsed points.
 *
 * @internal
 */
export const parsePathResponse = (
  response: string,
  timestampDelta: number = 0
): CursorGptPoint[] => {
  try {
    const points: CursorGptPoint[] = z
      .array(CursorGptPointSchema)
      .parse(JSON.parse(response.trim()))

    const baseTimestamp: number = Date.now() + timestampDelta

    points.forEach((point, i) => {
      if (i === 0) {
        point.timestamp = baseTimestamp
      } else {
        point.timestamp = baseTimestamp + points[i].timestamp
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
