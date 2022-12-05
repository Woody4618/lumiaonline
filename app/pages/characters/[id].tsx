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
          <>
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
                    }}
                  >
                    <Text variant="small" color="lightText">Experience</Text>
                    <Text variant="small">
                      {character.experience.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="small" color="lightText">Hitpoints</Text>
                    <Text variant="small">
                      {character.hitpoints.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="small" color="lightText">Deaths</Text>
                    <Text variant="small">{character.deaths.toString()}</Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="small" color="lightText">Melee Skill</Text>
                    <Text variant="small">
                      {character.meleeSkill.toString()}
                    </Text>
                  </Flex>
                  <Flex
                    sx={{
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="small" color="lightText">In Quest</Text>
                    <Text variant="small">
                      {character.questState ? "true" : "false"}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </>
        ) : (
          <LoadingIcon />
        )}
      </Layout>
    </>
  )
}

export default CharacterPage
