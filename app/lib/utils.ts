import { ProgramAccount, utils, web3 } from "@project-serum/anchor"
import {
  Connection,
  GetProgramAccountsFilter,
  MemcmpFilter,
  PublicKey,
} from "@solana/web3.js"
import { CharacterAccount } from "./gen/accounts"
import { PROGRAM_ID } from "./gen/programId"

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

export const getCharacters = async (
  connection: Connection
  // owner: PublicKey,
) => {
  // const filters = [
  //   accountFilter(CharacterAccount.discriminator),
  //   memcmp(10, owner.toBase58()),
  // ]

  const accounts = await fetchAccounts(connection, [])

  return Promise.all(
    accounts.map(async ({ pubkey, account }) => ({
      pubkey,
      account: CharacterAccount.decode(account.data),
    }))
  )
}

export const getCharacterAddress = (
  owner: web3.PublicKey,
  nftMint: web3.PublicKey,
  charactersProgram: web3.PublicKey
): web3.PublicKey => {
  return web3.PublicKey.findProgramAddressSync(
    [Buffer.from("character"), owner.toBuffer(), nftMint.toBuffer()],
    charactersProgram
  )[0]
}

export const getTokenMetadataAddress = (
  nftMint: web3.PublicKey
): web3.PublicKey => {
  return web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]
}

const memcmp = (offset: number, bytes: string): MemcmpFilter => {
  return {
    memcmp: {
      offset,
      bytes,
    },
  }
}

const accountFilter = (discriminator: Buffer) => {
  return memcmp(0, utils.bytes.bs58.encode(discriminator))
}

const fetchAccounts = (
  connection: Connection,
  filters: GetProgramAccountsFilter[]
) => {
  return connection.getProgramAccounts(PROGRAM_ID, {
    encoding: "base64",
    filters,
  })
}
