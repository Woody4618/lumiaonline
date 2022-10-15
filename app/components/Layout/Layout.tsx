/** @jsxImportSource theme-ui */
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { CharacterAccount } from "lib/gen/accounts"
import { getCharacters } from "lib/program-utils"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Flex, Heading } from "theme-ui"
import Header from "../Header/Header"
import CharacterSelect from "./CharacterSelect"

export interface ILayoutProps {}

export type CharacterApiResponseWithNft = {
  pubkey: PublicKey
  account: CharacterAccount
} & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}
export function Layout({ children }: { children: React.ReactNode }) {
  const { publicKey } = useWallet()
  const { connection } = useConnection()
  const [characters, setCharacters] =
    useState<CharacterApiResponseWithNft[]>(null)

  useEffect(() => {
    if (publicKey) {
      ;(async () => {
        const userCharacters = await getCharacters(connection, publicKey)

        const metaplex = Metaplex.make(connection)

        const withNft = await Promise.all(
          userCharacters.map(async (character) => {
            const nft = await metaplex
              .nfts()
              .findByMint({ mintAddress: character.account.nftMint })
              .run()

            return Object.assign(character, { nft })
          })
        )
        setCharacters(withNft)
      })()
    }
  }, [publicKey])

  return (
    <Flex
      sx={{
        minHeight: "100vh",
        flexDirection: "column",
      }}
    >
      <Header />

      <Flex
        sx={{
          flex: 1,
        }}
      >
        <Flex
          aria-label="menu"
          sx={{
            display: "flex",

            flexDirection: "column",
            width: "16rem",
            padding: "1.6rem 3.2rem",
            listStyle: "none",
            gap: "1.6rem",
            background: "background2",
          }}
          role="menu"
        >
          <CharacterSelect name="character" characters={characters} />
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Heading variant="heading3">Community</Heading>
            <Flex
              sx={{
                flexDirection: "column",
              }}
            >
              <Link href="/characters">Characters</Link>
              <Link href="/battles">Latest Battles</Link>
              <Link href="/highscores">Highscores</Link>
            </Flex>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Heading variant="heading3">Play</Heading>
            <Flex
              sx={{
                flexDirection: "column",
              }}
            >
              <Link href="/battles/join">Join Battle</Link>
              <Link href="/quests">Join Quest</Link>
            </Flex>
          </Flex>
        </Flex>
        <main
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "64rem",
            margin: "0 auto",
            padding: "0 1.6rem",

            "@media (min-width: 64rem)": {
              minWidth: "64rem",
            },
          }}
        >
          <Flex
            sx={{
              flexDirection: "column",
              /** Workaround to keep it centralized in relation to the mennu */
              marginLeft: "-16rem",
              paddingTop: "4rem",
            }}
          >
            {children}
          </Flex>
        </main>
      </Flex>
    </Flex>
  )
}
