import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface JoinQuestAccounts {
  quest: PublicKey
  character: PublicKey
  owner: PublicKey
  nftMint: PublicKey
}

export function joinQuest(accounts: JoinQuestAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quest, isSigner: false, isWritable: false },
    { pubkey: accounts.character, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([179, 5, 14, 3, 119, 119, 118, 89])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
