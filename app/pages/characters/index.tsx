/** @jsxImportSource theme-ui */
import { Heading, Text, Flex } from "@theme-ui/components"

import { useEffect, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacters } from "lib/program-utils"
import { CharacterAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js"
import { Layout } from "@/components/Layout/Layout"

import { TableColumn } from "react-data-table-component"
import { DataTable } from "@/components/DataTable/DataTable"
import Link from "next/link"

const columns: TableColumn<CharacterResponse>[] = [
  {
    name: "NFT",
    cell: (row) => {
      return (
        <img
          sx={{
            maxWidth: "6.4rem",
            borderRadius: ".4rem",
          }}
          src={row.nft.json.image}
        />
      )
    },
  },
  {
    name: "Name",
    selector: (row) => row.account.name.toString(),
    sortable: true,
    cell: (row) => {
      return (
        <>
          <Link href={`/characters/${row.pubkey}`}>
            <a>
              <Text
                sx={{
                  cursor: "pointer",
                }}
              >
                {row.account.name.toString()}
              </Text>
            </a>
          </Link>
        </>
      )
    },
  },
  {
    name: "Experience",
    selector: (row) => row.account.experience.toString(),
    sortable: true,
  },
]

type CharacterResponse = {
  pubkey: web3.PublicKey
  account: CharacterAccount
} & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}
export default function Characters() {
  const { connection } = useConnection()
  const [characters, setCharacters] = useState<CharacterResponse[]>(null)

  console.log(characters)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const characters = await getCharacters(connection)

        const metaplex = Metaplex.make(connection)

        const withNft = await Promise.all(
          characters.map(async (character) => {
            const nft = await metaplex
              .nfts()
              .findByMint({ mintAddress: character.account.nftMint })
              .run()

            return Object.assign(character, { nft })
          })
        )

        setCharacters(withNft)
      }
    })()
  }, [connection])

  return (
    <Layout>
      <Heading mb=".8rem" variant="heading1">
        Characters
      </Heading>
      <Text mb="3.2rem">List of created characters</Text>

      <Flex
        sx={{
          flexDirection: "column",
          gap: "1.6rem",
        }}
      >
        {characters ? (
          <DataTable columns={columns} data={characters} theme="chainquest" />
        ) : (
          <LoadingIcon />
        )}
      </Flex>
    </Layout>
  )
}
