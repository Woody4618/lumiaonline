import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateQuestArgs {
  duration: BN
  rewardExp: BN
  id: string
}

export interface CreateQuestAccounts {
  quest: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.i64("duration"),
  borsh.u64("rewardExp"),
  borsh.str("id"),
])

export function createQuest(
  args: CreateQuestArgs,
  accounts: CreateQuestAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.quest, isSigner: false, isWritable: true },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([112, 49, 32, 224, 255, 173, 5, 7])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      duration: args.duration,
      rewardExp: args.rewardExp,
      id: args.id,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
