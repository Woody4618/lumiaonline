/** @jsxImportSource theme-ui */
import Head from "next/head"

import { Heading, Text, Flex, Button } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletIcon } from "@/components/icons"
import WalletConnectButton from "@/components/WalletConnectButton"

export default function Home() {
  const { publicKey } = useWallet()

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
          This is definitely an RPG
        </Heading>
        <Text>Exactly as the title says.</Text>

        {/** User Onboarding */}
        <Flex
          sx={{
            flexDirection: "column",
            margin: "6.4rem 0",
          }}
        >
          <Link href="/create">
            <Button>Play now!</Button>
          </Link>{" "}
          {!publicKey ? (
            <Flex
              sx={{
                alignItems: "center",
                gap: ".8rem",
                margin: "1.6rem 0",
              }}
            >
              <Text variant="small">Already registered? </Text>

              <WalletConnectButton
                label={
                  <Flex
                    sx={{
                      alignItems: "center",
                      gap: ".4rem",
                    }}
                  >
                    <WalletIcon
                      sx={{
                        height: "2.4rem",
                        width: "2.4rem",
                        stroke: "primary",
                      }}
                    />
                    Log-in
                  </Flex>
                }
              />
            </Flex>
          ) : null}
        </Flex>

        {/* <Flex
          sx={{
            gap: "1.6rem",
            marginBottom: "3.2rem",
          }}
          >
          <Heading mt="3.2rem" variant="heading2">
            Characters
          </Heading>
          <Link href="/create">Create</Link> or{" "}
          <Link href="/characters">List</Link>
        </Flex>
        <Heading variant="heading2">Quests</Heading>
        <Flex>
          <Link href="/quests">List</Link>
        </Flex>
        <Heading mt="3.2rem" variant="heading2">
          Battles
        </Heading>
        <Flex
          sx={{
            gap: "1.6rem",
            marginBottom: "3.2rem",
          }}
        >
          <Link href="/battle">join battle</Link>
          <Link href="/battles">battle list</Link>
        </Flex> */}
      </main>
    </>
  )
}
