/**
 * Returns the value if it is not null or undefined, otherwise throws an error.
 *
 * @param value - The value to check.
 * @param error - The error to throw if the value is null or undefined.
 *
 * @returns The value if it is not null or undefined.
 *
 * @throws The error if the value is null or undefined.
 *
 * @public
 */
export const nonNullable = <T>(
  value: T | undefined | null,
  error: Error | string = "Missing required value"
): NonNullable<T> => {
  if (value === undefined || value === null) {
    if (typeof error === "string") {
      throw new Error(error)
    } else {
      throw error
    }
  }
  return value
}

/**
 * Accumulates the values of the given positional arguments into a single string
 * value.
 *
 * @param lines - The lines to merge.
 * @returns The merged lines as a string.
 *
 * @public
 */
export const merge = (...lines: string[]): string =>
  lines.map((line) => line.trim()).join("\n")
