import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateMonsterSpawnArgs {
  spawntime: BN
}

export interface CreateMonsterSpawnAccounts {
  monsterSpawn: PublicKey
  monsterType: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
  clock: PublicKey
}

export const layout = borsh.struct([borsh.i64("spawntime")])

export function createMonsterSpawn(
  args: CreateMonsterSpawnArgs,
  accounts: CreateMonsterSpawnAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.monsterSpawn, isSigner: false, isWritable: true },
    { pubkey: accounts.monsterType, isSigner: false, isWritable: true },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.clock, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([1, 149, 111, 168, 187, 114, 238, 139])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      spawntime: args.spawntime,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
