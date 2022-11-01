import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MonsterTypeAccountFields {
  config: types.MonsterConfigFields
}

export interface MonsterTypeAccountJSON {
  config: types.MonsterConfigJSON
}

export class MonsterTypeAccount {
  readonly config: types.MonsterConfig

  static readonly discriminator = Buffer.from([124, 151, 222, 83, 50, 9, 6, 7])

  static readonly layout = borsh.struct([types.MonsterConfig.layout("config")])

  constructor(fields: MonsterTypeAccountFields) {
    this.config = new types.MonsterConfig({ ...fields.config })
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<MonsterTypeAccount | null> {
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
  ): Promise<Array<MonsterTypeAccount | null>> {
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

  static decode(data: Buffer): MonsterTypeAccount {
    if (!data.slice(0, 8).equals(MonsterTypeAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = MonsterTypeAccount.layout.decode(data.slice(8))

    return new MonsterTypeAccount({
      config: types.MonsterConfig.fromDecoded(dec.config),
    })
  }

  toJSON(): MonsterTypeAccountJSON {
    return {
      config: this.config.toJSON(),
    }
  }

  static fromJSON(obj: MonsterTypeAccountJSON): MonsterTypeAccount {
    return new MonsterTypeAccount({
      config: types.MonsterConfig.fromJSON(obj.config),
    })
  }
}
