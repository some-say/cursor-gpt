import { parsePathResponse } from "./parsers"

describe(`parsePathResponse`, () => {
  const currentTime: number = Date.now()

  test(`parses string correctly`, () => {
    const points = parsePathResponse(
      JSON.stringify([
        {
          x: 0,
          y: 100,
          deltaTime: 0
        }
      ])
    )

    expect(points.length).toBe(1)
    expect(points[0].x).toBe(0)
    expect(points[0].y).toBe(100)
    expect(points[0].timestamp).toBeGreaterThanOrEqual(currentTime)
  })

  test(`throws on non-json input`, () => {
    expect(() => parsePathResponse("INVALID")).toThrow()
  })
})
