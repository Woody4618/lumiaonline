import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface MonsterConfigFields {
  id: string
  hitpoints: BN
  meleeSkill: number
}

export interface MonsterConfigJSON {
  id: string
  hitpoints: string
  meleeSkill: number
}

export class MonsterConfig {
  readonly id: string
  readonly hitpoints: BN
  readonly meleeSkill: number

  constructor(fields: MonsterConfigFields) {
    this.id = fields.id
    this.hitpoints = fields.hitpoints
    this.meleeSkill = fields.meleeSkill
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.str("id"), borsh.u64("hitpoints"), borsh.u8("meleeSkill")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new MonsterConfig({
      id: obj.id,
      hitpoints: obj.hitpoints,
      meleeSkill: obj.meleeSkill,
    })
  }

  static toEncodable(fields: MonsterConfigFields) {
    return {
      id: fields.id,
      hitpoints: fields.hitpoints,
      meleeSkill: fields.meleeSkill,
    }
  }

  toJSON(): MonsterConfigJSON {
    return {
      id: this.id,
      hitpoints: this.hitpoints.toString(),
      meleeSkill: this.meleeSkill,
    }
  }

  static fromJSON(obj: MonsterConfigJSON): MonsterConfig {
    return new MonsterConfig({
      id: obj.id,
      hitpoints: new BN(obj.hitpoints),
      meleeSkill: obj.meleeSkill,
    })
  }

  toEncodable() {
    return MonsterConfig.toEncodable(this)
  }
}
