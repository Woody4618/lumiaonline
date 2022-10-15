/** @jsxImportSource theme-ui */
import { Heading, Text, Flex } from "@theme-ui/components"

import { useWallet } from "@solana/wallet-adapter-react"
import WalletConnectButton from "@/components/WalletConnectButton"
import { WalletIcon } from "@/components/icons"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import { useEffect, useState } from "react"

export default function Home() {
  const { publicKey, wallet } = useWallet()

  /** Being ready doesn't mean it is connected, it only means the provider has finished running */
  const [isWalletReady, setIsWalletReady] = useState(false)

  useEffect(() => {
    /**
     * If there is localStorage for the wallet adapter
     * It means the provider will try to connect automatically.
     * So we wait for the wallet to be ready
     * Before assuming the user hasn't connected.
     */
    const walletName = localStorage.getItem("walletName")

    if (walletName && publicKey) {
      setIsWalletReady(true)
    } else if (!walletName) {
      setIsWalletReady(true)
    }
  }, [publicKey, wallet])

  // const isOnboarding = !localStorage.getItem('onboardDone')

  return (
    <>
      <Heading
        sx={{
          alignSelf: "stretch",
        }}
        mb="1.6rem"
        variant="heading"
      >
        {isWalletReady && !publicKey ? (
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
            {publicKey ? `Gm,` : `Gm`}
            <Text
              sx={{
                display: "flex",
              }}
              variant="heading3"
            >
              {publicKey ? publicKey?.toString().slice(0, 6) + "..." : null}
            </Text>
          </>
        )}
      </Heading>

      {isWalletReady && !publicKey ? <CreateCharacterForm /> : null}

      {/** Check for wallet as well to prevent flash */}
      {isWalletReady && !publicKey ? (
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
