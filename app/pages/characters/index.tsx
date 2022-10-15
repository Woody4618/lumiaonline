/** @jsxImportSource theme-ui */
import { Heading, Text, Label, Input, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
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

type CharacterResponse = {
  pubkey: web3.PublicKey
  account: CharacterAccount
} & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}
export default function Characters() {
  const { connection } = useConnection()
  const [characters, setCharacters] = useState<CharacterResponse[]>(null)

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
    <>
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
          characters.map((character) => {
            return (
              <Flex
                sx={{
                  alignItems: "center",
                  gap: ".8rem",
                }}
                key={character.pubkey.toString()}
              >
                <img
                  sx={{
                    maxWidth: "6.4rem",
                    borderRadius: ".4rem",
                  }}
                  src={character.nft.json.image}
                />
                <Flex
                  sx={{
                    flexDirection: "column",
                  }}
                >
                  <Text>{character.account.name}</Text>
                  <Text>
                    Experience: {character.account.experience.toNumber()}
                  </Text>
                  <Text>
                    Hitpoints: {character.account.hitpoints.toNumber()}
                  </Text>
                  <Text>deaths: {character.account.deaths}</Text>
                </Flex>
              </Flex>
            )
          })
        ) : (
          <LoadingIcon />
        )}
      </Flex>
    </>
  )
}
