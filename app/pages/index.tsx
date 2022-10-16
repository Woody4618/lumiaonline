/** @jsxImportSource theme-ui */
import { Heading, Text, Flex } from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"
import { WalletIcon } from "@/components/icons"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import useWalletWrapper from "@/hooks/useWalletWrapper"

export default function Home() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()

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
