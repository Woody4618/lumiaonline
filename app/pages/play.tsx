/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"
import { WalletIcon } from "@/components/icons"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import useWalletWrapper from "@/hooks/useWalletWrapper"
import WalletManager from "@/components/WalletManager/WalletManager"
import Link from "next/link"

export default function Play() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()

  // const isOnboarding = !localStorage.getItem('onboardDone')

  return (
    <Flex
      sx={{
        flexDirection: "column",
        alignItems: "center",
        padding: "0",
        flex: 1,
      }}
    >
      {isWalletReady && !publicKey ? (
        <Flex
          sx={{
            flexDirection: "column",
            gap: ".8rem",
            alignSelf: "center",
            margin: "auto",
          }}
        >
          Please, connect your wallet first:
          <WalletConnectButton label={<Button>Connect</Button>} />
        </Flex>
      ) : (
        <>
          <Flex
            sx={{
              background: "background2",
              padding: ".8rem 0",
              alignSelf: "stretch",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heading variant="heading2">
              {publicKey ? `Gm, ` : `Gm`}
              <Text variant="heading3">
                {publicKey ? publicKey?.toString().slice(0, 6) + "..." : null};
                You're in Vivendell
              </Text>
            </Heading>
          </Flex>
          <Flex
            sx={{
              alignSelf: "stretch",
              flexDirection: "column",
              order: 2,
              justifyContent: "center",

              "@media (min-width: 768px)": {
                flexDirection: "row",
                order: 1,
              },
            }}
          >
            <Flex
              aria-label="menu"
              sx={{
                display: "flex",

                flexDirection: "column",
                padding: "1.6rem 3.2rem",
                listStyle: "none",
                gap: "1.6rem",
                borderRight: "1px solid",
                borderColor: "background2",
              }}
              role="menu"
            >
              <Heading variant="heading3">Waypoints</Heading>
              <Flex
                sx={{
                  flexDirection: "column",
                }}
              >
                <Flex
                  sx={{
                    flexDirection: "column",
                    gap: ".8rem",
                  }}
                >
                  <Link href="/characters">
                    <Button variant="secondary">Magic Shop</Button>
                  </Link>
                  <Link href="/characters">
                    <Button variant="secondary">Equipment Shop</Button>
                  </Link>
                  <Link href="/characters">
                    <Button variant="secondary">Wilderness</Button>
                  </Link>
                  <Link href="/characters">
                    <Button variant="secondary">Boat</Button>
                  </Link>
                </Flex>
              </Flex>
            </Flex>
            <img
              sx={{
                maxWidth: "78rem",
                order: 1,
                width: "100%",
                height: "100%",

                "@media (min-width: 768px)": {
                  flexDirection: "row",
                  order: 2,
                },
                // maxWidth: "80vw",
              }}
              src="https://cdn2.inkarnate.com/cdn-cgi/image/width=1800,height=1400/https://inkarnate-api-as-production.s3.amazonaws.com/vvno70tauo7bgaald7mjt2nf5vb6"
            />
          </Flex>
        </>
      )}
    </Flex>
  )
}
