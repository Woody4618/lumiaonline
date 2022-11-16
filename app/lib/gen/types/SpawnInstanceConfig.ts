import { PublicKey } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh"

export interface SpawnInstanceConfigFields {
  monsterName: string
  spawntime: BN
}

export interface SpawnInstanceConfigJSON {
  monsterName: string
  spawntime: string
}

export class SpawnInstanceConfig {
  readonly monsterName: string
  readonly spawntime: BN

  constructor(fields: SpawnInstanceConfigFields) {
    this.monsterName = fields.monsterName
    this.spawntime = fields.spawntime
  }

  static layout(property?: string) {
    return borsh.struct(
      [borsh.str("monsterName"), borsh.u64("spawntime")],
      property
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDecoded(obj: any) {
    return new SpawnInstanceConfig({
      monsterName: obj.monsterName,
      spawntime: obj.spawntime,
    })
  }

  static toEncodable(fields: SpawnInstanceConfigFields) {
    return {
      monsterName: fields.monsterName,
      spawntime: fields.spawntime,
    }
  }

  toJSON(): SpawnInstanceConfigJSON {
    return {
      monsterName: this.monsterName,
      spawntime: this.spawntime.toString(),
    }
  }

  static fromJSON(obj: SpawnInstanceConfigJSON): SpawnInstanceConfig {
    return new SpawnInstanceConfig({
      monsterName: obj.monsterName,
      spawntime: new BN(obj.spawntime),
    })
  }

  toEncodable() {
    return SpawnInstanceConfig.toEncodable(this)
  }
}
