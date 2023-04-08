import { merge } from "../../support"
import type { CursorGptPath, CursorGptPrompt } from "./types"

/**
 * Prompt templates to be used to compose the ChatGPT messages.
 *
 * Although not recommended, you can modify these values to change the
 * prompt sequence sent to the OpenAI API.
 *
 */
export const pathPrompts: CursorGptPrompt[] = [
  {
    order: 1,
    name: `init`,
    content: merge(
      `I want you to act as an experienced website user experience tester, with particular focus on natural human mouse gestures, such as cursor paths, bezier curves, and other user behavior.`
    )
  },
  {
    order: 2,
    name: `task`,
    content: merge(
      `I will provide you with a prompt consisting of "Start Position", "End Position", "Initial Timestamp", "Duration" and your job is to imagine and describe a natural human mouse cursor path from the "Start Position" coordinates to the "End Position" coordinates.`,
      `The "Duration" represents the amount of time the full cursor path should take in milliseconds.`,
      `The "Initial Timestamp" represents the time at which the first point of cursor path should begin in milliseconds.`,
      `The "Start Position" and "End Position" are x and y floating point coordinates representing a point on the screen in pixels.`,
      `Avoid creating paths that are straight or follow a perfect curve as this is not a natural human gesture.`,
      `Paths should include a variety of mouse velocities and acceleration, and should have minor imperfections.`,
      `Add random curvy variations and adjustments to the path in the way a human gesture would.`,
      `Make sure the path "overshoots" the "End Position" by 1% or 2% and then return the "End Position" as this is a natural human behavior.`
    )
  },
  {
    order: 3,
    name: `response`,
    content: merge(
      `You will provide your responses as a JSON array of mouse coordinate objects in the following format:`,
      `{"x": number, "y": number, "timestamp": number }`,
      `The "x" and "y" values are the floating point coordinates of the mouse cursor at a given point in time. These should never represent a straight line.`,
      `The first position in the series should be the "Start Position" coordinates with a "deltaTime" of 0, and the last position should be the "End Position" coordinates.`,
      `The "timestamp" value is the amount of time in milliseconds that has passed since the "Initial Timestamp" and represents mouse cursor velocity.`,
      `The timestamp velocity between points should accurately mimic the velocity of a natural user gesture.`,
      `The duration between the first and last timestamp should not exceed the provided "Duration".`,
      `The final position in the path must always be the "End Position" coordinates and the final "Timestamp" value should always be the "Duration" value.`,
      `The array of points should not have more than 30 points per 1000ms Duration.`
    )
  },
  {
    order: 4,
    name: `examples`,
    content: merge(
      `Assume your role is to generate the output for this function:`,
      `
function generateMousePath({ start: { x: number, y: number }, end: { x: number, y: number }, duration: number, initialTimestamp: number }): { x: number, y: number, timestamp: number }[] {
  // return a realistic-looking mouse path using the guidelines above.
  // differences in timestamps should represent mouse velocity along the path.
  // the path should never be a straight line.
}
`
    )
  },
  {
    order: 4,
    name: `constraints`,
    content: merge(
      `Do not include any natural language in your response, only return a JSON array.`,
      `Make use of any information you have about modelling human mouse gestures, and any mouse gesture data you have collected.`,
      `Ensure the content of your response can be parsed as a valid JSON array using the JavaScript "JSON.parse()" function.`,
      `Imagine the shape of the path and check it meets the requirements before generating the response.`
    )
  }
]

/**
 * Collects and sorts current prompts in order.
 *
 * @returns An array of prompt strings in order.
 *
 * @public
 */
export const getPathPrompts = (): string[] =>
  pathPrompts
    .sort((a, b) => a.order - b.order)
    .map(({ content }) => content)
    .filter((content) => content !== "\n")

/**
 * Generates the final execution prompt to trigger the completion.
 *
 * @param path - The path to complete.
 *
 * @returns The final execution prompt as string.
 *
 * @public
 */
export const createPathPrompt = ({
  start,
  end,
  duration
}: CursorGptPath): string =>
  merge(
    `Use the following "Path Config" to draw a human-like mouse gesture path from the "Start Position" to the "End Position" and return it in the array format described above.`,
    `Start Position: { "x": ${start.x}, "y": ${start.y} }`,
    `End Position: { "x": ${end.x}, "y": ${end.y} }`,
    `Duration: ${duration}`,
    `Initial Timestamp: 0`
  )

/**
 * Update a prompt by name.
 *
 * @param name - The name of the prompt to update.
 * @param content - The new content of the prompt.
 * @returns `true` if the prompt was updated, `false` otherwise.
 *
 * @public
 */
export const updatePathPrompt = (name: string, content: string): boolean => {
  const prompt = pathPrompts.find((prompt) => prompt.name === name)

  if (!prompt) {
    return false
  }

  prompt.content = content
  return true
}
