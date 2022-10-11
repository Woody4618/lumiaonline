/** @jsxImportSource theme-ui */
import { Heading, Text, Label, Input, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacters } from "lib/utils"
import { CharacterAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"

type CharacterResponse = {
  pubkey: web3.PublicKey
  account: CharacterAccount
}
export default function Characters() {
  const { connection } = useConnection()
  const [characters, setCharacters] = useState<CharacterResponse[]>(null)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const res = await getCharacters(connection)
        console.log(res)
        setCharacters(res)
      }
    })()
  }, [connection])

  return (
    <>
      <Header />
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          marginTop: "4rem",
          padding: "0 1.6rem",
        }}
      >
        <Heading mb=".8rem" variant="heading1">
          Characters
        </Heading>
        <Text mb="3.2rem">List of created characters</Text>

        {characters ? (
          characters.map((character) => {
            return (
              <Flex key={character.pubkey.toString()}>
                {character.account.name}
              </Flex>
            )
          })
        ) : (
          <LoadingIcon />
        )}
      </main>
    </>
  )
}
