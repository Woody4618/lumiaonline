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
      <Heading
        sx={{
          alignSelf: "stretch",
        }}
        mb="1.6rem"
        variant="heading"
      >
        {isOnboarding || !publicKey ? (
          <>
            Gm,
            <Text
              sx={{
                display: "flex",
              }}
              variant="heading3"
            >
              Let's start with your character
            </Text>
          </>
        ) : (
          <>
            Gm,
            <Text
              sx={{
                display: "flex",
              }}
              variant="heading3"
            >
              {publicKey.toString().slice(0, 6)}...
              {/* Let's start with your character */}
            </Text>
          </>
        )}
      </Heading>

      {isOnboarding || !publicKey ? <CreateCharacterForm /> : null}

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
