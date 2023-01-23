import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface VaultFields {
  owner: PublicKey
  authority: PublicKey
  bump: Array<number>
}

export interface VaultJSON {
  owner: string
  authority: string
  bump: Array<number>
}

export class Vault {
  readonly owner: PublicKey
  readonly authority: PublicKey
  readonly bump: Array<number>

  static readonly discriminator = Buffer.from([
    211, 8, 232, 43, 2, 152, 117, 119,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("owner"),
    borsh.publicKey("authority"),
    borsh.array(borsh.u8(), 1, "bump"),
  ])

  constructor(fields: VaultFields) {
    this.owner = fields.owner
    this.authority = fields.authority
    this.bump = fields.bump
  }

  static async fetch(c: Connection, address: PublicKey): Promise<Vault | null> {
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
  ): Promise<Array<Vault | null>> {
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

  static decode(data: Buffer): Vault {
    if (!data.slice(0, 8).equals(Vault.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = Vault.layout.decode(data.slice(8))

    return new Vault({
      owner: dec.owner,
      authority: dec.authority,
      bump: dec.bump,
    })
  }

  toJSON(): VaultJSON {
    return {
      owner: this.owner.toString(),
      authority: this.authority.toString(),
      bump: this.bump,
    }
  }

  static fromJSON(obj: VaultJSON): Vault {
    return new Vault({
      owner: new PublicKey(obj.owner),
      authority: new PublicKey(obj.authority),
      bump: obj.bump,
    })
  }
}
