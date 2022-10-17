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

  if (!isWalletReady || selectedCharacter === null) {
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

  if (isWalletReady && !publicKey) {
    return (
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
    )
  }

  if (selectedCharacter !== null && !selectedCharacter) {
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
            {selectedCharacter && selectedCharacter?.account?.name}. You're in
            Vivendell
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
            minWidth: "28rem",
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
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                      alignSelf: "flex-start",
                    }}
                    src="/assets/icon_equipment.png"
                  />
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
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                      alignSelf: "flex-start",
                    }}
                    src="/assets/icon_magic.png"
                  />
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
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                      alignSelf: "flex-start",
                    }}
                    src="/assets/icon_quests.png"
                  />
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
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                      alignSelf: "flex-start",
                    }}
                    src="/assets/icon_sailboat.png"
                  />
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
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                      alignSelf: "flex-start",
                    }}
                    src="/assets/icon_wilderness.png"
                  />
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
        <Flex
          sx={{
            order: 1,

            "@media (min-width: 768px)": {
              flexDirection: "row",
              order: 2,
            },
          }}
        >
          <img src="/assets/teristraz.png" />
        </Flex>
      </Flex>
    </Flex>
  )
}
