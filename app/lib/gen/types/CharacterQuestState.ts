import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface CharacterQuestStateFields {
  startedAt: BN
  questId: string
}

export interface CharacterQuestStateJSON {
  startedAt: string
  questId: string
}

export class CharacterQuestState {
  readonly startedAt: BN
  readonly questId: string

  constructor(fields: CharacterQuestStateFields) {
    this.startedAt = fields.startedAt
    this.questId = fields.questId
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.i64("startedAt"), borsh.str("questId")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new CharacterQuestState({
      startedAt: obj.startedAt,
      questId: obj.questId,
    })
  }

  static toEncodable(fields: CharacterQuestStateFields) {
    return {
      startedAt: fields.startedAt,
      questId: fields.questId,
    }
  }

  toJSON(): CharacterQuestStateJSON {
    return {
      startedAt: this.startedAt.toString(),
      questId: this.questId,
    }
  }

  static fromJSON(obj: CharacterQuestStateJSON): CharacterQuestState {
    return new CharacterQuestState({
      startedAt: new BN(obj.startedAt),
      questId: obj.questId,
    })
  }

  toEncodable() {
    return CharacterQuestState.toEncodable(this)
  }
}
