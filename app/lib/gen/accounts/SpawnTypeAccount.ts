import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface SpawnTypeAccountFields {
  monsterType: PublicKey
  spawntime: BN
  lastKilled: BN | null
}

export interface SpawnTypeAccountJSON {
  monsterType: string
  spawntime: string
  lastKilled: string | null
}

export class MonsterSpawnAccount {
  readonly monsterType: PublicKey
  readonly spawntime: BN
  readonly lastKilled: BN | null

  static readonly discriminator = Buffer.from([
    90, 81, 143, 40, 109, 242, 236, 135,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("monsterType"),
    borsh.i64("spawntime"),
    borsh.option(borsh.i64(), "lastKilled"),
  ])

  constructor(fields: SpawnTypeAccountFields) {
    this.monsterType = fields.monsterType
    this.spawntime = fields.spawntime
    this.lastKilled = fields.lastKilled
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<MonsterSpawnAccount | null> {
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
  ): Promise<Array<MonsterSpawnAccount | null>> {
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

  static decode(data: Buffer): MonsterSpawnAccount {
    if (!data.slice(0, 8).equals(MonsterSpawnAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = MonsterSpawnAccount.layout.decode(data.slice(8))

    return new MonsterSpawnAccount({
      monsterType: dec.monsterType,
      spawntime: dec.spawntime,
      lastKilled: dec.lastKilled,
    })
  }

  toJSON(): SpawnTypeAccountJSON {
    return {
      monsterType: this.monsterType.toString(),
      spawntime: this.spawntime.toString(),
      lastKilled: (this.lastKilled && this.lastKilled.toString()) || null,
    }
  }

  static fromJSON(obj: SpawnTypeAccountJSON): MonsterSpawnAccount {
    return new MonsterSpawnAccount({
      monsterType: new PublicKey(obj.monsterType),
      spawntime: new BN(obj.spawntime),
      lastKilled: (obj.lastKilled && new BN(obj.lastKilled)) || null,
    })
  }
}
