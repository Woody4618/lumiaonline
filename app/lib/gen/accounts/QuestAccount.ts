import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface QuestAccountFields {
  config: types.QuestConfigFields
}

export interface QuestAccountJSON {
  config: types.QuestConfigJSON
}

export class QuestAccount {
  readonly config: types.QuestConfig

  static readonly discriminator = Buffer.from([
    150, 179, 23, 90, 199, 60, 121, 92,
  ])

  static readonly layout = borsh.struct([types.QuestConfig.layout("config")])

  constructor(fields: QuestAccountFields) {
    this.config = new types.QuestConfig({ ...fields.config })
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
      config: types.QuestConfig.fromDecoded(dec.config),
    })
  }

  toJSON(): QuestAccountJSON {
    return {
      config: this.config.toJSON(),
    }
  }

  static fromJSON(obj: QuestAccountJSON): QuestAccount {
    return new QuestAccount({
      config: types.QuestConfig.fromJSON(obj.config),
    })
  }
}
