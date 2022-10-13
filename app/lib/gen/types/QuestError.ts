import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface InvalidTimestampJSON {
  kind: "InvalidTimestamp"
}

export class InvalidTimestamp {
  static readonly discriminator = 0
  static readonly kind = "InvalidTimestamp"
  readonly discriminator = 0
  readonly kind = "InvalidTimestamp"

  toJSON(): InvalidTimestampJSON {
    return {
      kind: "InvalidTimestamp",
    }
  }

  toEncodable() {
    return {
      InvalidTimestamp: {},
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromDecoded(obj: any): types.QuestErrorKind {
  if (typeof obj !== "object") {
    throw new Error("Invalid enum object")
  }

  if ("InvalidTimestamp" in obj) {
    return new InvalidTimestamp()
  }

  throw new Error("Invalid enum object")
}

export function fromJSON(obj: types.QuestErrorJSON): types.QuestErrorKind {
  switch (obj.kind) {
    case "InvalidTimestamp": {
      return new InvalidTimestamp()
    }
  }
}

export function layout(property?: string) {
  const ret = borsh.rustEnum([borsh.struct([], "InvalidTimestamp")])
  if (property !== undefined) {
    return ret.replicate(property)
  }
  return ret
}
