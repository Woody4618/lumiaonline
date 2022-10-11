export type CustomError = MaxNameLengthExceeded | InvalidOwner

export class MaxNameLengthExceeded extends Error {
  static readonly code = 6000
  readonly code = 6000
  readonly name = "MaxNameLengthExceeded"
  readonly msg = "Name is too long. Max. length is 16 bytes."

  constructor(readonly logs?: string[]) {
    super("6000: Name is too long. Max. length is 16 bytes.")
  }
}

export class InvalidOwner extends Error {
  static readonly code = 6001
  readonly code = 6001
  readonly name = "InvalidOwner"
  readonly msg = "Owner must be the current holder."

  constructor(readonly logs?: string[]) {
    super("6001: Owner must be the current holder.")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new MaxNameLengthExceeded(logs)
    case 6001:
      return new InvalidOwner(logs)
  }

  return null
}
