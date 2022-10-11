import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CharacterAccountFields {
  name: string
  experience: number
}

export interface CharacterAccountJSON {
  name: string
  experience: number
}

export class CharacterAccount {
  readonly name: string
  readonly experience: number

  static readonly discriminator = Buffer.from([
    152, 189, 17, 17, 119, 227, 48, 55,
  ])

  static readonly layout = borsh.struct([
    borsh.str("name"),
    borsh.u32("experience"),
  ])

  constructor(fields: CharacterAccountFields) {
    this.name = fields.name
    this.experience = fields.experience
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<CharacterAccount | null> {
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
  ): Promise<Array<CharacterAccount | null>> {
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

  static decode(data: Buffer): CharacterAccount {
    if (!data.slice(0, 8).equals(CharacterAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = CharacterAccount.layout.decode(data.slice(8))

    return new CharacterAccount({
      name: dec.name,
      experience: dec.experience,
    })
  }

  toJSON(): CharacterAccountJSON {
    return {
      name: this.name,
      experience: this.experience,
    }
  }

  static fromJSON(obj: CharacterAccountJSON): CharacterAccount {
    return new CharacterAccount({
      name: obj.name,
      experience: obj.experience,
    })
  }
}
