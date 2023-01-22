/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/** @jsxImportSource theme-ui */
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { Layout } from "@/components/Layout/Layout"
import {
  Metaplex,
  Nft,
  NftWithToken,
  Sft,
  SftWithToken,
} from "@metaplex-foundation/js"
import { useConnection } from "@solana/wallet-adapter-react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Heading, Flex, Text } from "theme-ui"
import { CharacterAccount } from "lib/gen/accounts"
import { PublicKey } from "@solana/web3.js"
import Head from "next/head"

type Character = CharacterAccount & {
  nft: Sft | SftWithToken | Nft | NftWithToken
}

const CharacterPage: NextPage = () => {
  const router = useRouter()
  const { connection } = useConnection()
  const [character, setCharacter] = useState<Character>(null)

  const { id } = router.query

  useEffect(() => {
    ;(async () => {
      if (connection && !character) {
        try {
          const character = await CharacterAccount.fetch(
            connection,
            new PublicKey(id)
          )

          if (character) {
            const metaplex = Metaplex.make(connection)

            const nft = await metaplex
              .nfts()
              .findByMint({ mintAddress: character.nftMint })
              .run()

            setCharacter(Object.assign(character, { nft }))
          }
        } catch (e) {
          console.error(e)
        }
      }
    })()
  }, [connection, character])

  return (
    <>
      <Head>
        <title>Character Page</title>
      </Head>
      <Layout>
        {character ? (
          <Flex
            sx={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Flex
              mb=".8rem"
              sx={{
                alignItems: "center",
              }}
            >
              <img
                sx={{
                  maxWidth: "6.4rem",
                  borderRadius: ".4rem",
                }}
                src={character.nft.json.image}
              />
              <Heading mb=".8rem" ml=".8rem" variant="heading1">
                {character.name.toString()}
              </Heading>
            </Flex>
            <Flex
              sx={{
                flexDirection: "column",
              }}
            >
              <Flex
                sx={{
                  flexDirection: "column",
                  maxWidth: "20rem",
                }}
              >
                <Flex
                  mb=".4rem"
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text>Attribute</Text>
                  <Text>Value</Text>
                </Flex>
                <Flex
                  sx={{
                    flexDirection: "column",
                    gap: ".4rem",
                  }}
                >
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      Experience
                    </Text>
                    <Text variant="small">
                      {character.experience.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      Level
                    </Text>
                    <Text variant="small">{character.level.toString()}</Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      Hitpoints
                    </Text>
                    <Text variant="small">
                      {character.hitpoints.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      Deaths
                    </Text>
                    <Text variant="small">{character.deaths.toString()}</Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      Melee Skill
                    </Text>
                    <Text variant="small">
                      {character.meleeSkill.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "5rem",
                    }}
                  >
                    <Text variant="small" color="lightText">
                      In Quest
                    </Text>
                    <Text variant="small">
                      {character.questState ? "true" : "false"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <LoadingIcon />
        )}
      </Layout>
    </>
  )
}

export default CharacterPage
