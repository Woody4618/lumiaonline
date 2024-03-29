import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DeathFields {
  monsterId: string
  timestamp: BN
}

export interface DeathJSON {
  monsterId: string
  timestamp: string
}

export class Death {
  readonly monsterId: string
  readonly timestamp: BN

  constructor(fields: DeathFields) {
    this.monsterId = fields.monsterId
    this.timestamp = fields.timestamp
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.str("monsterId"), borsh.i64("timestamp")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Death({
      monsterId: obj.monsterId,
      timestamp: obj.timestamp,
    })
  }

  static toEncodable(fields: DeathFields) {
    return {
      monsterId: fields.monsterId,
      timestamp: fields.timestamp,
    }
  }

  toJSON(): DeathJSON {
    return {
      monsterId: this.monsterId,
      timestamp: this.timestamp.toString(),
    }
  }

  static fromJSON(obj: DeathJSON): Death {
    return new Death({
      monsterId: obj.monsterId,
      timestamp: new BN(obj.timestamp),
    })
  }

  toEncodable() {
    return Death.toEncodable(this)
  }
}
