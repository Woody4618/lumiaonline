import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CharacterAccountFields {
  owner: PublicKey
  nftMint: PublicKey
  name: string
  experience: BN
  hitpoints: BN
  deaths: Array<types.DeathFields>
  questState: types.QuestStateFields | null
}

export interface CharacterAccountJSON {
  owner: string
  nftMint: string
  name: string
  experience: string
  hitpoints: string
  deaths: Array<types.DeathJSON>
  questState: types.QuestStateJSON | null
}

export class CharacterAccount {
  readonly owner: PublicKey
  readonly nftMint: PublicKey
  readonly name: string
  readonly experience: BN
  readonly hitpoints: BN
  readonly deaths: Array<types.Death>
  readonly questState: types.QuestState | null

  static readonly discriminator = Buffer.from([
    152, 189, 17, 17, 119, 227, 48, 55,
  ])

  static readonly layout = borsh.struct([
    borsh.publicKey("owner"),
    borsh.publicKey("nftMint"),
    borsh.str("name"),
    borsh.u64("experience"),
    borsh.u64("hitpoints"),
    borsh.vec(types.Death.layout(), "deaths"),
    borsh.option(types.QuestState.layout(), "questState"),
  ])

  constructor(fields: CharacterAccountFields) {
    this.owner = fields.owner
    this.nftMint = fields.nftMint
    this.name = fields.name
    this.experience = fields.experience
    this.hitpoints = fields.hitpoints
    this.deaths = fields.deaths.map((item) => new types.Death({ ...item }))
    this.questState =
      (fields.questState && new types.QuestState({ ...fields.questState })) ||
      null
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
      owner: dec.owner,
      nftMint: dec.nftMint,
      name: dec.name,
      experience: dec.experience,
      hitpoints: dec.hitpoints,
      deaths: dec.deaths.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.Death.fromDecoded(item)
      ),
      questState:
        (dec.questState && types.QuestState.fromDecoded(dec.questState)) ||
        null,
    })
  }

  toJSON(): CharacterAccountJSON {
    return {
      owner: this.owner.toString(),
      nftMint: this.nftMint.toString(),
      name: this.name,
      experience: this.experience.toString(),
      hitpoints: this.hitpoints.toString(),
      deaths: this.deaths.map((item) => item.toJSON()),
      questState: (this.questState && this.questState.toJSON()) || null,
    }
  }

  static fromJSON(obj: CharacterAccountJSON): CharacterAccount {
    return new CharacterAccount({
      owner: new PublicKey(obj.owner),
      nftMint: new PublicKey(obj.nftMint),
      name: obj.name,
      experience: new BN(obj.experience),
      hitpoints: new BN(obj.hitpoints),
      deaths: obj.deaths.map((item) => types.Death.fromJSON(item)),
      questState:
        (obj.questState && types.QuestState.fromJSON(obj.questState)) || null,
    })
  }
}
