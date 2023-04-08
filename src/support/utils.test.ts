import { merge, nonNullable } from "./utils"

describe(`"nonNullable" unit tests`, () => {
  test(`returns non-empty value`, async () => {
    expect(nonNullable("foo")).toBe("foo")
  })

  test(`throws on empty values`, async () => {
    expect(() => nonNullable(undefined)).toThrow()
    expect(() => nonNullable(null)).toThrow()
  })
})

describe(`"merge" unit tests`, () => {
  test(`returns all positional args as merged string`, async () => {
    expect(merge("foo", "bar")).toBe("foo\nbar")
  })

  test(`throws when provided non string values`, async () => {
    expect(() => merge("foo", 1 as unknown as string)).toThrow()
  })
})
