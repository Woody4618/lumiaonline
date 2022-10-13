import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MonsterAccountFields {
  config: types.MonsterConfigFields
}

export interface MonsterAccountJSON {
  config: types.MonsterConfigJSON
}

export class MonsterAccount {
  readonly config: types.MonsterConfig

  static readonly discriminator = Buffer.from([
    234, 56, 114, 123, 205, 233, 210, 142,
  ])

  static readonly layout = borsh.struct([types.MonsterConfig.layout("config")])

  constructor(fields: MonsterAccountFields) {
    this.config = new types.MonsterConfig({ ...fields.config })
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<MonsterAccount | null> {
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
  ): Promise<Array<MonsterAccount | null>> {
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

  static decode(data: Buffer): MonsterAccount {
    if (!data.slice(0, 8).equals(MonsterAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = MonsterAccount.layout.decode(data.slice(8))

    return new MonsterAccount({
      config: types.MonsterConfig.fromDecoded(dec.config),
    })
  }

  toJSON(): MonsterAccountJSON {
    return {
      config: this.config.toJSON(),
    }
  }

  static fromJSON(obj: MonsterAccountJSON): MonsterAccount {
    return new MonsterAccount({
      config: types.MonsterConfig.fromJSON(obj.config),
    })
  }
}
