import { PROGRAM_ID } from "../programId"
import * as anchor from "./anchor"
import * as custom from "./custom"

export function fromCode(
  code: number,
  logs?: string[]
): custom.CustomError | anchor.AnchorError | null {
  return code >= 6000
    ? custom.fromCode(code, logs)
    : anchor.fromCode(code, logs)
}

const errorRe = /custom program error: (\w+)/

export function fromTxError(
  err: unknown
): custom.CustomError | anchor.AnchorError | null {
  if (typeof err !== "object" || err === null) {
    return null
  }

  const match = errorRe.exec(err + "")

  if (match === null) {
    return null
  }

  const [codeRaw] = match.slice(1)

  let errorCode: number
  try {
    errorCode = parseInt(codeRaw, 16)
  } catch (parseErr) {
    return null
  }

  return fromCode(errorCode)
}
