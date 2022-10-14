import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface JoinBattleArgs {
  battleTurns: Array<types.BattleTurnFields>
}

export interface JoinBattleAccounts {
  battle: PublicKey
  character: PublicKey
  monster: PublicKey
  owner: PublicKey
  clock: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.vec(types.BattleTurn.layout(), "battleTurns"),
])

export function joinBattle(args: JoinBattleArgs, accounts: JoinBattleAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.battle, isSigner: true, isWritable: true },
    { pubkey: accounts.character, isSigner: false, isWritable: true },
    { pubkey: accounts.monster, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([126, 0, 69, 130, 127, 145, 54, 100])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      battleTurns: args.battleTurns.map((item) =>
        types.BattleTurn.toEncodable(item)
      ),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
