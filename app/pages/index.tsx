/** @jsxImportSource theme-ui */
import { Heading, Text, Flex } from "@theme-ui/components"

import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/router"
import WalletConnectButton from "@/components/WalletConnectButton"
import { WalletIcon } from "@/components/icons"
import WalletManager from "@/components/WalletManager/WalletManager"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"

export default function Home() {
  const { publicKey, wallet } = useWallet()
  const { query } = useRouter()

  const isOnboarding = query.onboarding === "true" || !wallet

  return (
    <>
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          alignSelf: "stretch",
          minHeight: "9rem",
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
      </Flex>

      <Heading mb="1.6rem" variant="heading">
        {isOnboarding ? (
          <>
            Gm. <br />
            Let's start with your character
          </>
        ) : (
          "Create a new character"
        )}
      </Heading>

      <CreateCharacterForm />

      {/** Check for wallet as well to prevent flash */}
      {!publicKey && !wallet ? (
        <Flex
          sx={{
            alignItems: "center",
            gap: ".8rem",
            margin: "1.6rem 0",
            alignSelf: "center",
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
    </>
  )
}
