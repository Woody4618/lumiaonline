/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"
import {
  BoatIcon,
  DotsIcon,
  MagicIcon,
  ShirtIcon,
  WalletIcon,
  WildernessIcon,
} from "@/components/icons"
import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import useWalletWrapper from "@/hooks/useWalletWrapper"
import WalletManager from "@/components/WalletManager/WalletManager"
import Link from "next/link"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"

export default function Play() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()
  const { selectedCharacter } = useContext(characterContext)

  // const isOnboarding = !localStorage.getItem('onboardDone')

  if (!isWalletReady) {
    return (
      <Text
        sx={{
          alignItems: "center",
          margin: "auto",
        }}
      >
        <LoadingIcon />
      </Text>
    )
  }

  if (!selectedCharacter) {
    return (
      <Text
        sx={{
          alignItems: "center",
          margin: "auto",
        }}
      >
        Please,{" "}
        <Link passHref href="/characters/new">
          create a character
        </Link>{" "}
        first.
      </Text>
    )
  }

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
              justifyContent: "space-evenly",
            }}
          >
            <Heading variant="heading2">
              {publicKey ? `Gm, ` : `Gm`}
              <Text variant="heading3">
                {/* {publicKey ? publicKey?.toString().slice(0, 6) + "..." : null}; */}
                {selectedCharacter?.account.name}. You're in Vivendell
              </Text>
            </Heading>
            <WalletManager />
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
                  <Link passHref href="/characters">
                    <Button variant="gameButton">
                      {/* <ShirtIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                      Equipment Shop
                    </Button>
                  </Link>
                  <Link passHref href="/characters">
                    <Button variant="gameButton">
                      {/* <MagicIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                      Magic Shop
                    </Button>
                  </Link>

                  <Link passHref href="/characters">
                    <Button variant="gameButton">
                      {/* <DotsIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                      Quests
                    </Button>
                  </Link>

                  <Link passHref href="/characters">
                    <Button variant="gameButton">
                      {/* <BoatIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                      Sailboat
                    </Button>
                  </Link>
                  <Link passHref href="/characters">
                    <Button variant="gameButton">
                      {/* <WildernessIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                      Wilderness
                    </Button>
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
