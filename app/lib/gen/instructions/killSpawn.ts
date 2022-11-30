import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface KillSpawnAccounts {
  monsterType: PublicKey
  monsterSpawn: PublicKey
  owner: PublicKey
  clock: PublicKey
  systemProgram: PublicKey
}

export function killSpawn(accounts: KillSpawnAccounts) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.monsterType, isSigner: false, isWritable: true },
    { pubkey: accounts.monsterSpawn, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([72, 104, 16, 215, 247, 249, 133, 96])
  const data = identifier
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
