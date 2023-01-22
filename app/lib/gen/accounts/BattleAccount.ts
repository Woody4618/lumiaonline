import { PublicKey, Connection } from "@solana/web3.js"
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface BattleAccountFields {
  battleTurns: Array<types.BattleTurnFields>
  participants: Array<PublicKey>
  timestamp: BN
}

export interface BattleAccountJSON {
  battleTurns: Array<types.BattleTurnJSON>
  participants: Array<string>
  timestamp: string
}

/** Holds information about a battle between a character and a monster */
export class BattleAccount {
  readonly battleTurns: Array<types.BattleTurn>
  readonly participants: Array<PublicKey>
  readonly timestamp: BN

  static readonly discriminator = Buffer.from([
    151, 107, 3, 106, 43, 65, 131, 90,
  ])

  static readonly layout = borsh.struct([
    borsh.vec(types.BattleTurn.layout(), "battleTurns"),
    borsh.vec(borsh.publicKey(), "participants"),
    borsh.i64("timestamp"),
  ])

  constructor(fields: BattleAccountFields) {
    this.battleTurns = fields.battleTurns.map(
      (item) => new types.BattleTurn({ ...item })
    )
    this.participants = fields.participants
    this.timestamp = fields.timestamp
  }

  static async fetch(
    c: Connection,
    address: PublicKey
  ): Promise<BattleAccount | null> {
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
  ): Promise<Array<BattleAccount | null>> {
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

  static decode(data: Buffer): BattleAccount {
    if (!data.slice(0, 8).equals(BattleAccount.discriminator)) {
      throw new Error("invalid account discriminator")
    }

    const dec = BattleAccount.layout.decode(data.slice(8))

    return new BattleAccount({
      battleTurns: dec.battleTurns.map(
        (
          item: any /* eslint-disable-line @typescript-eslint/no-explicit-any */
        ) => types.BattleTurn.fromDecoded(item)
      ),
      participants: dec.participants,
      timestamp: dec.timestamp,
    })
  }

  toJSON(): BattleAccountJSON {
    return {
      battleTurns: this.battleTurns.map((item) => item.toJSON()),
      participants: this.participants.map((item) => item.toString()),
      timestamp: this.timestamp.toString(),
    }
  }

  static fromJSON(obj: BattleAccountJSON): BattleAccount {
    return new BattleAccount({
      battleTurns: obj.battleTurns.map((item) =>
        types.BattleTurn.fromJSON(item)
      ),
      participants: obj.participants.map((item) => new PublicKey(item)),
      timestamp: new BN(obj.timestamp),
    })
  }
}
