import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as types from "../types" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateMonsterTypeArgs {
  name: string
  hitpoints: BN
  meleeSkill: number
  experience: BN
}

export interface CreateMonsterTypeAccounts {
  monsterType: PublicKey
  signer: PublicKey
  systemProgram: PublicKey
}

export const layout = borsh.struct([
  borsh.str("name"),
  borsh.u64("hitpoints"),
  borsh.u8("meleeSkill"),
  borsh.u64("experience"),
])

export function createMonsterType(
  args: CreateMonsterTypeArgs,
  accounts: CreateMonsterTypeAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.monsterType, isSigner: false, isWritable: true },
    { pubkey: accounts.signer, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([210, 117, 218, 106, 172, 133, 65, 86])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      name: args.name,
      hitpoints: args.hitpoints,
      meleeSkill: args.meleeSkill,
      experience: args.experience,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
