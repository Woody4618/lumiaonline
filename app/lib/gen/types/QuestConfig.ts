import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface QuestConfigFields {
  duration: BN
  rewardExp: BN
  id: string
}

export interface QuestConfigJSON {
  duration: string
  rewardExp: string
  id: string
}

export class QuestConfig {
  readonly duration: BN
  readonly rewardExp: BN
  readonly id: string

  constructor(fields: QuestConfigFields) {
    this.duration = fields.duration
    this.rewardExp = fields.rewardExp
    this.id = fields.id
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.i64("duration"), borsh.u64("rewardExp"), borsh.str("id")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuestConfig({
      duration: obj.duration,
      rewardExp: obj.rewardExp,
      id: obj.id,
    })
  }

  static toEncodable(fields: QuestConfigFields) {
    return {
      duration: fields.duration,
      rewardExp: fields.rewardExp,
      id: fields.id,
    }
  }

  toJSON(): QuestConfigJSON {
    return {
      duration: this.duration.toString(),
      rewardExp: this.rewardExp.toString(),
      id: this.id,
    }
  }

  static fromJSON(obj: QuestConfigJSON): QuestConfig {
    return new QuestConfig({
      duration: new BN(obj.duration),
      rewardExp: new BN(obj.rewardExp),
      id: obj.id,
    })
  }

  toEncodable() {
    return QuestConfig.toEncodable(this)
  }
}
