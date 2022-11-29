import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SpawnInstanceAccountFields {
  config: types.SpawnInstanceConfigFields
  lastKilled: BN | null
}

export interface SpawnInstanceAccountJSON {
  config: types.SpawnInstanceConfigJSON
  lastKilled: string | null
}

export class SpawnInstanceAccount {
  readonly config: types.SpawnInstanceConfig
  readonly lastKilled: BN | null

  static readonly discriminator = Buffer.from([
    153, 244, 216, 251, 187, 82, 158, 70,
  ])

  static readonly layout = borsh.struct([
    types.SpawnInstanceConfig.layout("config"),
    borsh.option(borsh.i64(), "lastKilled"),
  ])

  constructor(fields: SpawnInstanceAccountFields) {
    this.config = new types.SpawnInstanceConfig({ ...fields.config })
    this.lastKilled = fields.lastKilled
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<SpawnInstanceAccount | null> {
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
  ): Promise<Array<SpawnInstanceAccount | null>> {
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

  static decode(data: Buffer): SpawnInstanceAccount {
    if (!data.slice(0, 8).equals(SpawnInstanceAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = SpawnInstanceAccount.layout.decode(data.slice(8))

    return new SpawnInstanceAccount({
      config: types.SpawnInstanceConfig.fromDecoded(dec.config),
      lastKilled: dec.lastKilled,
    })
  }

  toJSON(): SpawnInstanceAccountJSON {
    return {
      config: this.config.toJSON(),
      lastKilled: (this.lastKilled && this.lastKilled.toString()) || null,
    }
  }

  static fromJSON(obj: SpawnInstanceAccountJSON): SpawnInstanceAccount {
    return new SpawnInstanceAccount({
      config: types.SpawnInstanceConfig.fromJSON(obj.config),
      lastKilled: (obj.lastKilled && new BN(obj.lastKilled)) || null,
    })
  }
}
