import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface BattleTurnFields {
  characterDamage: BN
  monsterDamage: BN
  characterHitpoints: BN
  monsterHitpoints: BN
}

export interface BattleTurnJSON {
  characterDamage: string
  monsterDamage: string
  characterHitpoints: string
  monsterHitpoints: string
}

export class BattleTurn {
  readonly characterDamage: BN
  readonly monsterDamage: BN
  readonly characterHitpoints: BN
  readonly monsterHitpoints: BN

  constructor(fields: BattleTurnFields) {
    this.characterDamage = fields.characterDamage
    this.monsterDamage = fields.monsterDamage
    this.characterHitpoints = fields.characterHitpoints
    this.monsterHitpoints = fields.monsterHitpoints
  }

  static layout(property?: string) {
    return borsh.struct(
      [
        borsh.u64("characterDamage"),
        borsh.u64("monsterDamage"),
        borsh.i64("characterHitpoints"),
        borsh.i64("monsterHitpoints"),
      ],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new BattleTurn({
      characterDamage: obj.characterDamage,
      monsterDamage: obj.monsterDamage,
      characterHitpoints: obj.characterHitpoints,
      monsterHitpoints: obj.monsterHitpoints,
    })
  }

  static toEncodable(fields: BattleTurnFields) {
    return {
      characterDamage: fields.characterDamage,
      monsterDamage: fields.monsterDamage,
      characterHitpoints: fields.characterHitpoints,
      monsterHitpoints: fields.monsterHitpoints,
    }
  }

  toJSON(): BattleTurnJSON {
    return {
      characterDamage: this.characterDamage.toString(),
      monsterDamage: this.monsterDamage.toString(),
      characterHitpoints: this.characterHitpoints.toString(),
      monsterHitpoints: this.monsterHitpoints.toString(),
    }
  }

  static fromJSON(obj: BattleTurnJSON): BattleTurn {
    return new BattleTurn({
      characterDamage: new BN(obj.characterDamage),
      monsterDamage: new BN(obj.monsterDamage),
      characterHitpoints: new BN(obj.characterHitpoints),
      monsterHitpoints: new BN(obj.monsterHitpoints),
    })
  }

  toEncodable() {
    return BattleTurn.toEncodable(this)
  }
}
