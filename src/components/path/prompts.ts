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
      `I want you to act as an experienced website user experience tester, with particular focus on natural human mouse gestures, such as cursor paths, mouse scrolls, and other user behavior.`
    )
  },
  {
    order: 2,
    name: `task`,
    content: merge(
      `I will provide you with a prompt consisting of "Start Position", "End Position", "Duration" and your job is to imagine and describe a natural human mouse cursor path from the "Start Position" coordinates to the "End Position" coordinates.`,
      `The "Duration" represents the amount of time the full cursor path should take in milliseconds.`,
      `The mouse path you create should be as natural as possible, and should not be a straight line between the start and end coordinates.`,
      `Avoid creating paths that are highly precise or follow a perfect curve, as this is not a natural human gesture.`,
      `Add random variations to the path in the way a human gesture would, and ensure that it does not take less time than the provided "duration" value.`
    )
  },
  {
    order: 3,
    name: `response`,
    content: merge(
      `You will provide your responses as a JSON array of mouse coordinate objects in the following format:`,
      `
      {"x": number, "y": number, "deltaTime": number }
      `,
      `The "x" and "y" values are the coordinates of the mouse cursor at a given point in time.`,
      `The first position in the series should be the "Start Position" coordinates with a "deltaTime" of 0, and the last position should be the "End Position" coordinates.`,
      `The "deltaTime" value is the amount of time in milliseconds that has passed since the previous position and represents mouse cursor velocity.`,
      `For example, if position[2] is 100ms after position[1], then position[2].deltaTime should be 100. If position[3] is 20ms after position[2], then position[3].deltaTime should be 20.`,
      `The "deltaTime" value should be highly varied to accurately mimic the timings of a natural user gesture.`,
      `Do not repeat the same "deltaTime" value more than once.`,
      `The sum of all "deltaTime" values in the array should not exceed the total provided "Duration" time, make sure to check and correct this before returning your final response.`
    )
  },
  {
    order: 4,
    name: `constraints`,
    content: merge(
      `Do not include any natural language in your response.`,
      `Ensure the content of your response can be parsed as a valid JSON array using the JavaScript "JSON.parse()" function.`
    )
  }
]

export const getPathPrompts = (): string[] =>
  pathPrompts
    .sort((a, b) => a.order - b.order)
    .map(({ content }) => content)
    .filter((content) => content !== "\n")

export const createPathPrompt = ({
  start,
  end,
  duration
}: CursorGptPath): string =>
  merge(
    `Use the following "Path Config" to create a natural mouse cursor path from the "Start Position" to the "End Position".`,
    `Start Position: { "x": ${start.x}, "y": ${start.y} }`,
    `End Position: { "x": ${end.x}, "y": ${end.y} }`,
    `Duration: ${duration}`
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
