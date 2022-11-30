import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface QuestAccountFields {
  duration: BN
  rewardExp: BN
  id: string
}

export interface QuestAccountJSON {
  duration: string
  rewardExp: string
  id: string
}

export class QuestAccount {
  readonly duration: BN
  readonly rewardExp: BN
  readonly id: string

  static readonly discriminator = Buffer.from([
    150, 179, 23, 90, 199, 60, 121, 92,
  ])

  static readonly layout = borsh.struct([
    borsh.i64("duration"),
    borsh.u64("rewardExp"),
    borsh.str("id"),
  ])

  constructor(fields: QuestAccountFields) {
    this.duration = fields.duration
    this.rewardExp = fields.rewardExp
    this.id = fields.id
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<QuestAccount | null> {
    const info = await c.getAccountInfo(address)

    if (info === null) {
      return null
    }
    if (!info.owner.equals(PROGRAM_ID)) {
      throw new Error("account doesn't belong to this program")
    }

    return this.decode(info.data)
  }

  static async fetchMultiple(
    c: Connection,
    addresses: PublicKey[]
  ): Promise<Array<QuestAccount | null>> {
    const infos = await c.getMultipleAccountsInfo(addresses)

    return infos.map((info) => {
      if (info === null) {
        return null
      }
      if (!info.owner.equals(PROGRAM_ID)) {
        throw new Error("account doesn't belong to this program")
      }

      return this.decode(info.data)
    })
  }

  static decode(data: Buffer): QuestAccount {
    if (!data.slice(0, 8).equals(QuestAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = QuestAccount.layout.decode(data.slice(8))

    return new QuestAccount({
      duration: dec.duration,
      rewardExp: dec.rewardExp,
      id: dec.id,
    })
  }

  toJSON(): QuestAccountJSON {
    return {
      duration: this.duration.toString(),
      rewardExp: this.rewardExp.toString(),
      id: this.id,
    }
  }

  static fromJSON(obj: QuestAccountJSON): QuestAccount {
    return new QuestAccount({
      duration: new BN(obj.duration),
      rewardExp: new BN(obj.rewardExp),
      id: obj.id,
    })
  }
}
