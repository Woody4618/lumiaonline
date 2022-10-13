import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface QuestStateFields {
  startedAt: BN
  questUuid: string
}

export interface QuestStateJSON {
  startedAt: string
  questUuid: string
}

export class QuestState {
  readonly startedAt: BN
  readonly questUuid: string

  constructor(fields: QuestStateFields) {
    this.startedAt = fields.startedAt
    this.questUuid = fields.questUuid
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.i64("startedAt"), borsh.str("questUuid")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new QuestState({
      startedAt: obj.startedAt,
      questUuid: obj.questUuid,
    })
  }

  static toEncodable(fields: QuestStateFields) {
    return {
      startedAt: fields.startedAt,
      questUuid: fields.questUuid,
    }
  }

  toJSON(): QuestStateJSON {
    return {
      startedAt: this.startedAt.toString(),
      questUuid: this.questUuid,
    }
  }

  static fromJSON(obj: QuestStateJSON): QuestState {
    return new QuestState({
      startedAt: new BN(obj.startedAt),
      questUuid: obj.questUuid,
    })
  }

  toEncodable() {
    return QuestState.toEncodable(this)
  }
}
