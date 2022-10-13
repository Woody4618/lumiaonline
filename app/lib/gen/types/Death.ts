import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface DeathFields {
  monsterUuid: string
  timestamp: BN
}

export interface DeathJSON {
  monsterUuid: string
  timestamp: string
}

export class Death {
  readonly monsterUuid: string
  readonly timestamp: BN

  constructor(fields: DeathFields) {
    this.monsterUuid = fields.monsterUuid
    this.timestamp = fields.timestamp
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.str("monsterUuid"), borsh.i64("timestamp")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new Death({
      monsterUuid: obj.monsterUuid,
      timestamp: obj.timestamp,
    })
  }

  static toEncodable(fields: DeathFields) {
    return {
      monsterUuid: fields.monsterUuid,
      timestamp: fields.timestamp,
    }
  }

  toJSON(): DeathJSON {
    return {
      monsterUuid: this.monsterUuid,
      timestamp: this.timestamp.toString(),
    }
  }

  static fromJSON(obj: DeathJSON): Death {
    return new Death({
      monsterUuid: obj.monsterUuid,
      timestamp: new BN(obj.timestamp),
    })
  }

  toEncodable() {
    return Death.toEncodable(this)
  }
}
