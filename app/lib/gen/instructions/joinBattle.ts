import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface JoinBattleAccounts {
  character: PublicKey
  monster: PublicKey
  clock: PublicKey
}

/** * Character will be able to battle a monster til death. */
export function joinBattle(accounts: JoinBattleAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.character, isSigner: false, isWritable: true },
    { pubkey: accounts.monster, isSigner: false, isWritable: true },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([126, 0, 69, 130, 127, 145, 54, 100])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
