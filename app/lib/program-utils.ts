import { ProgramAccount, utils, web3 } from "@project-serum/anchor"
import {
  Connection,
  GetProgramAccountsFilter,
  MemcmpFilter,
  TransactionInstruction,
} from "@solana/web3.js"
import {
  BattleAccount,
  CharacterAccount,
  MonsterTypeAccount,
  QuestAccount,
  MonsterSpawnAccount,
} from "./gen/accounts"
import { PROGRAM_ID } from "./gen/programId"

export const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

export const getParsedIx = (rawIx: {
  keys: { pubkey: string; isSigner: boolean; isWritable: boolean }[]
  programId: string
  data: Buffer
}) => {
  const ixKeys = rawIx.keys.map((key) => {
    const encodedPubKey = new web3.PublicKey(key.pubkey)

    return Object.assign(key, { pubkey: encodedPubKey })
  })

  const ix: TransactionInstruction = {
    keys: ixKeys,
    data: rawIx.data,
    programId: new web3.PublicKey(rawIx.programId),
  }

  return ix
}

export const getQuests = async (
  connection: Connection
  // owner: PublicKey,
) => {
  const filters = [
    accountFilter(QuestAccount.discriminator),
    // memcmp(10, owner.toBase58()),
  ]

  const accounts = await fetchAccounts(connection, filters)

  return Promise.all(
    accounts.map(async ({ pubkey, account }) => ({
      pubkey,
      account: QuestAccount.decode(account.data),
    }))
  )
}

export const getSpawnInstances = async (
  connection: Connection
  // owner: PublicKey,
) => {
  const filters = [
    accountFilter(MonsterSpawnAccount.discriminator),
    // memcmp(10, owner.toBase58()),
  ]

  const accounts = await fetchAccounts(connection, filters)

  return Promise.all(
    accounts.map(async ({ pubkey, account }) => ({
      pubkey,
      account: MonsterSpawnAccount.decode(account.data),
    }))
  )
}

export const getMonsters = async (
  connection: Connection
  // owner: PublicKey,
) => {
  const filters = [
    accountFilter(MonsterTypeAccount.discriminator),
    // memcmp(10, owner.toBase58()),
  ]

  const accounts = await fetchAccounts(connection, filters)

  return Promise.all(
    accounts.map(async ({ pubkey, account }) => ({
      pubkey,
      account: MonsterTypeAccount.decode(account.data),
    }))
  )
}

export const getBattles = async (
  connection: Connection
  // owner: PublicKey,
) => {
  const filters = [
    accountFilter(BattleAccount.discriminator),
    // memcmp(10, owner.toBase58()),
  ]

  const accounts = await fetchAccounts(connection, filters)

  return Promise.all(
    accounts.map(async ({ pubkey, account }) => ({
      pubkey,
      account: BattleAccount.decode(account.data),
    }))
  )
}

export const getCharacters = async (
  connection: Connection,
  owner?: web3.PublicKey
) => {
  const filters = [accountFilter(CharacterAccount.discriminator)]

  if (owner) {
    filters.push(memcmp(8, owner.toBase58()))
  }

  const accounts = await fetchAccounts(connection, filters)

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
