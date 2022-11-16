import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateSpawnInstanceArgs {
  config: types.SpawnInstanceConfigFields
}

export interface CreateSpawnInstanceAccounts {
  spawnInstance: PublicKey
  monsterType: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.SpawnInstanceConfig.layout("config")])

export function createSpawnInstance(
  args: CreateSpawnInstanceArgs,
  accounts: CreateSpawnInstanceAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.spawnInstance, isSigner: false, isWritable: true },
    { pubkey: accounts.monsterType, isSigner: false, isWritable: false },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([125, 25, 12, 138, 60, 117, 98, 143])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      config: types.SpawnInstanceConfig.toEncodable(args.config),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
