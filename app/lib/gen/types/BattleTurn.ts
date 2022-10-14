import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BattleTurnFields {
  characterDamage: BN
  monsterDamage: BN
}

export interface BattleTurnJSON {
  characterDamage: string
  monsterDamage: string
}

export class BattleTurn {
  readonly characterDamage: BN
  readonly monsterDamage: BN

  constructor(fields: BattleTurnFields) {
    this.characterDamage = fields.characterDamage
    this.monsterDamage = fields.monsterDamage
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.u64("characterDamage"), borsh.u64("monsterDamage")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new BattleTurn({
      characterDamage: obj.characterDamage,
      monsterDamage: obj.monsterDamage,
    })
  }

  static toEncodable(fields: BattleTurnFields) {
    return {
      characterDamage: fields.characterDamage,
      monsterDamage: fields.monsterDamage,
    }
  }

  toJSON(): BattleTurnJSON {
    return {
      characterDamage: this.characterDamage.toString(),
      monsterDamage: this.monsterDamage.toString(),
    }
  }

  static fromJSON(obj: BattleTurnJSON): BattleTurn {
    return new BattleTurn({
      characterDamage: new BN(obj.characterDamage),
      monsterDamage: new BN(obj.monsterDamage),
    })
  }

  toEncodable() {
    return BattleTurn.toEncodable(this)
  }
}
