import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateMonsterArgs {
  config: types.MonsterConfigFields
}

export interface CreateMonsterAccounts {
  monster: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([types.MonsterConfig.layout("config")])

export function createMonster(
  args: CreateMonsterArgs,
  accounts: CreateMonsterAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.monster, isSigner: false, isWritable: true },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([191, 236, 127, 56, 10, 211, 227, 139])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      config: types.MonsterConfig.toEncodable(args.config),
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
