export class DryRunHaltError extends Error {
  public override readonly name: string = "DryRunHaltError"
  public constructor() {
    super("Dry run halted.")
  }
}

export class ApiError extends Error {
  public override readonly name: string = "ApiError"

  public constructor(message: string, cause?: Error) {
    super(message, { cause })
  }
}
