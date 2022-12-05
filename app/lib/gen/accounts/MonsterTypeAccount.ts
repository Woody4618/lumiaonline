import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface MonsterTypeAccountFields {
  name: string
  hitpoints: BN
  meleeSkill: number
  experience: BN
}

export interface MonsterTypeAccountJSON {
  name: string
  hitpoints: string
  meleeSkill: number
  experience: string
}

/** Monster Type is a type of monster that can be spawned. It holds all information about a monster */
export class MonsterTypeAccount {
  readonly name: string
  readonly hitpoints: BN
  readonly meleeSkill: number
  readonly experience: BN

  static readonly discriminator = Buffer.from([124, 151, 222, 83, 50, 9, 6, 7])

  static readonly layout = borsh.struct([
    borsh.str("name"),
    borsh.u64("hitpoints"),
    borsh.u8("meleeSkill"),
    borsh.u64("experience"),
  ])

  constructor(fields: MonsterTypeAccountFields) {
    this.name = fields.name
    this.hitpoints = fields.hitpoints
    this.meleeSkill = fields.meleeSkill
    this.experience = fields.experience
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
      name: dec.name,
      hitpoints: dec.hitpoints,
      meleeSkill: dec.meleeSkill,
      experience: dec.experience,
    })
  }

  toJSON(): MonsterTypeAccountJSON {
    return {
      name: this.name,
      hitpoints: this.hitpoints.toString(),
      meleeSkill: this.meleeSkill,
      experience: this.experience.toString(),
    }
  }

  static fromJSON(obj: MonsterTypeAccountJSON): MonsterTypeAccount {
    return new MonsterTypeAccount({
      name: obj.name,
      hitpoints: new BN(obj.hitpoints),
      meleeSkill: obj.meleeSkill,
      experience: new BN(obj.experience),
    })
  }
}
