/** @jsxImportSource theme-ui */

import { Heading, Text, Flex, Button } from "@theme-ui/components"

import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletIcon } from "@/components/icons"
import WalletConnectButton from "@/components/WalletConnectButton"
import WalletManager from "@/components/WalletManager/WalletManager"

export default function Home() {
  const { publicKey, wallet } = useWallet()

  return (
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

        "@media (min-width: 64rem)": {
          minWidth: "64rem",
        },
      }}
    >
      {publicKey ? (
        <Flex
          sx={{
            margin: "3.2rem 0",
            alignSelf: "flex-end",
          }}
        >
          <WalletManager />
        </Flex>
      ) : null}
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
        <Link href="/characters/new?onboarding=true">
          <Button>Play now!</Button>
        </Link>{" "}
        {/** Check for wallet as well to prevent flash */}
        {!publicKey && !wallet ? (
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
    </main>
  )
}
