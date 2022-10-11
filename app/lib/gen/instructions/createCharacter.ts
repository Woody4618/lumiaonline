import { TransactionInstruction, PublicKey, AccountMeta } from "@solana/web3.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import BN from "bn.js" // eslint-disable-line @typescript-eslint/no-unused-vars
import * as borsh from "@project-serum/borsh" // eslint-disable-line @typescript-eslint/no-unused-vars
import { PROGRAM_ID } from "../programId"

export interface CreateCharacterArgs {
  name: string
}

export interface CreateCharacterAccounts {
  character: PublicKey
  /** Character owner keypair. */
  owner: PublicKey
  systemProgram: PublicKey
  /**
   * NFT Metadata account, owned by Metaplex metadata program (this address is automatically
   * derived by the anchor client).
   */
  tokenMetadata: PublicKey
  /** Metaplex Token Metadata program address. */
  tokenMetadataProgram: PublicKey
  /** NFT address owned by the SPL token program. */
  nftMint: PublicKey
  /** Character owner ATA that holds the NFT. */
  ownerTokenAccount: PublicKey
}

export const layout = borsh.struct([borsh.str("name")])

export function createCharacter(
  args: CreateCharacterArgs,
  accounts: CreateCharacterAccounts
) {
  const keys: Array<AccountMeta> = [
    { pubkey: accounts.character, isSigner: false, isWritable: true },
    { pubkey: accounts.owner, isSigner: true, isWritable: true },
    { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    { pubkey: accounts.tokenMetadata, isSigner: false, isWritable: false },
    {
      pubkey: accounts.tokenMetadataProgram,
      isSigner: false,
      isWritable: false,
    },
    { pubkey: accounts.nftMint, isSigner: false, isWritable: false },
    { pubkey: accounts.ownerTokenAccount, isSigner: false, isWritable: false },
  ]
  const identifier = Buffer.from([94, 208, 60, 158, 114, 52, 154, 50])
  const buffer = Buffer.alloc(1000)
  const len = layout.encode(
    {
      name: args.name,
    },
    buffer
  )
  const data = Buffer.concat([identifier, buffer]).slice(0, 8 + len)
  const ix = new TransactionInstruction({ keys, programId: PROGRAM_ID, data })
  return ix
}
