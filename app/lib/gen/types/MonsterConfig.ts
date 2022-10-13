import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface MonsterConfigFields {
  uuid: string
  hitpoints: BN
}

export interface MonsterConfigJSON {
  uuid: string
  hitpoints: string
}

export class MonsterConfig {
  readonly uuid: string
  readonly hitpoints: BN

  constructor(fields: MonsterConfigFields) {
    this.uuid = fields.uuid
    this.hitpoints = fields.hitpoints
  }

  static layout(property?: string) {
    return borsh.struct([borsh.str("uuid"), borsh.u64("hitpoints")], property)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new MonsterConfig({
      uuid: obj.uuid,
      hitpoints: obj.hitpoints,
    })
  }

  static toEncodable(fields: MonsterConfigFields) {
    return {
      uuid: fields.uuid,
      hitpoints: fields.hitpoints,
    }
  }

  toJSON(): MonsterConfigJSON {
    return {
      uuid: this.uuid,
      hitpoints: this.hitpoints.toString(),
    }
  }

  static fromJSON(obj: MonsterConfigJSON): MonsterConfig {
    return new MonsterConfig({
      uuid: obj.uuid,
      hitpoints: new BN(obj.hitpoints),
    })
  }

  toEncodable() {
    return MonsterConfig.toEncodable(this)
  }
}
