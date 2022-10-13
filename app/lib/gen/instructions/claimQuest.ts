import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface ClaimQuestAccounts {
  character: PublicKey
  quest: PublicKey
  nftMint: PublicKey
  owner: PublicKey
  clock: PublicKey
}

export function claimQuest(accounts: ClaimQuestAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.character, isSigner: false, isWritable: true },
    { pubkey: accounts.quest, isSigner: false, isWritable: false },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([38, 197, 33, 123, 0, 108, 206, 161])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
