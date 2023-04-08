import type { Page } from "puppeteer-core"

import { CursorGpt } from "../cursor"
import type { CursorGptPath } from "../components/path"
import type { CursorGptConfig, CursorGptOptions } from "../types"

/**
 * Create a per-Page handler for Puppeteer.
 * Uses CDP "mouseMoved" commands to move the cursor.
 *
 * @param config - Configuration for the CursorGpt instance.
 *
 * @returns A PuppeteerPlugin instance.
 *
 * @public
 */
export const createPuppeteerCursor = (
  config: CursorGptConfig
): PuppeteerPlugin => {
  // 1. Initialize CursorGpt instance.
  const cursor: CursorGpt = new CursorGpt(config)

  // 2. Define execution handler.
  const executePath = async (
    page: Page,
    path: CursorGptPath,
    options: CursorGptOptions = {}
  ): Promise<void> => {
    const points = await cursor.completePath(path, options)
    const client = await page.target().createCDPSession()

    for (const point of points) {
      await client.send("Input.dispatchMouseEvent", {
        type: "mouseMoved",
        x: point.x,
        y: point.y,
        timestamp: point.timestamp,
        modifiers: 0,
        button: "none",
        clickCount: 0
      })
    }
  }

  return {
    cursor,
    executePath
  } as const
}

/**
 * Puppeteer plugin interface.
 *
 * @public
 */
export interface PuppeteerPlugin {
  /** CursorGPT instance. */
  readonly cursor: CursorGpt

  /** Per-page handler for path completion and execution. */
  executePath(
    page: Page,
    path: CursorGptPath,
    options: CursorGptOptions
  ): Promise<void>
}
