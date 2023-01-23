export type CustomError =
  | MaxNameLengthExceeded
  | InvalidOwner
  | InvalidQuestTimestamp
  | InvalidSpawnTimestamp

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

export class InvalidQuestTimestamp extends Error {
  static readonly code = 6002
  readonly code = 6002
  readonly name = "InvalidQuestTimestamp"
  readonly msg = "The character hasn't been on this quest long enough."

  constructor(readonly logs?: string[]) {
    super("6002: The character hasn't been on this quest long enough.")
  }
}

export class InvalidSpawnTimestamp extends Error {
  static readonly code = 6003
  readonly code = 6003
  readonly name = "InvalidSpawnTimestamp"
  readonly msg = "The monster hasn't spawned yet."

  constructor(readonly logs?: string[]) {
    super("6003: The monster hasn't spawned yet.")
  }
}

export function fromCode(code: number, logs?: string[]): CustomError | null {
  switch (code) {
    case 6000:
      return new MaxNameLengthExceeded(logs)
    case 6001:
      return new InvalidOwner(logs)
    case 6002:
      return new InvalidQuestTimestamp(logs)
    case 6003:
      return new InvalidSpawnTimestamp(logs)
  }

  return null
}
