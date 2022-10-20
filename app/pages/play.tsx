/** @jsxImportSource theme-ui */
import {
  Heading,
  Text,
  Button,
  Flex,
  Link as ThemeLink,
} from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"

import { CreateCharacterForm } from "@/components/CreateCharacterForm"
import useWalletWrapper from "@/hooks/useWalletWrapper"
import WalletManager from "@/components/WalletManager/WalletManager"
import Link from "next/link"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import CharacterSelect from "@/components/Layout/CharacterSelect"
import { ArrowLeftIcon, BackIcon } from "@/components/icons"
import WayPoints from "components/Waypoints"
import { useRouter } from "next/router"

export default function Play() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()
  const { selectedCharacter, characters, setSelectedCharacter, isLoading } =
    useContext(characterContext)
  const { query } = useRouter()

  // const isOnboarding = !localStorage.getItem('onboardDone')

  if (!isWalletReady || isLoading) {
    return (
      <Text
        sx={{
          alignItems: "center",
          margin: "auto",
          display: "flex",
          gap: ".8rem",
        }}
      >
        <LoadingIcon /> Loading wallet...
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
          <a
            sx={{
              color: (theme) => theme.colors.primary + "!important",
            }}
          >
            create a character
          </a>
        </Link>{" "}
        first.
      </Text>
    )
  }

  const currentWaypoint = query.waypoint?.toString()
  /** Make it uppercase */
  const WaypointComponent = currentWaypoint
    ? WayPoints[
        currentWaypoint?.charAt(0).toUpperCase() + currentWaypoint?.slice(1)
      ]
    : null

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
          zIndex: 9,
          alignSelf: "stretch",
          justifyContent: "center",
          minHeight: "6.4rem",
        }}
      >
        <Flex
          sx={{
            alignItems: "center",
            padding: ".8rem 0",
            gap: "4.8rem",
          }}
        >
          <Flex
            sx={{
              alignItems: "center",
              gap: ".8rem",
            }}
          >
            <Link href="/" passHref>
              <a
                sx={{
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <ArrowLeftIcon
                  sx={{
                    width: "2.4rem",
                    height: "2.4rem",
                  }}
                />
              </a>
            </Link>
            <Flex
              sx={{
                alignItems: "center",
                gap: "1.6rem",
                marginRight: ".8rem",
              }}
            >
              <img
                src={selectedCharacter.nft.json.image}
                sx={{
                  maxHeight: "4.8rem",
                }}
              />
              {/* <Text mr="1.6rem">{selectedCharacter.account.name}</Text> */}
            </Flex>
            <Heading
              sx={{
                display: "none",
                "@media screen and (min-width: 768px)": {
                  display: "flex",
                  alignItems: "center",
                },
              }}
              variant="heading2"
            >
              {publicKey ? `Gm,` : `Gm`}
              &nbsp;{selectedCharacter && selectedCharacter?.account?.name}.
              {/* <Text ml="1.6rem" variant="small">
                You're in <b>Teristraz</b>
              </Text> */}
            </Heading>
          </Flex>
          <Text
            sx={{
              color: "#4bd84b",
            }}
            variant="xsmall"
          >
            &#8226;&nbsp;21 players online
          </Text>
          <WalletManager />
        </Flex>
      </Flex>

      {/** Mobile status bar */}
      <Heading
        sx={{
          display: "flex",
          alignItems: "center",
          zIndex: 9,

          "@media screen and (min-width: 768px)": {
            display: "none",
          },
        }}
        variant="heading2"
      >
        {publicKey ? `Gm, ` : `Gm`}
        <Text variant="heading3">
          {/* {publicKey ? publicKey?.toString().slice(0, 6) + "..." : null}; */}
          {selectedCharacter && selectedCharacter?.account?.name}. You're in
          Teristraz
        </Text>
      </Heading>

      <Flex
        sx={{
          alignSelf: "stretch",
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
            padding: "1.6rem 4.8rem",
            listStyle: "none",
            gap: "1.6rem",
            borderRight: "1px solid",
            borderColor: "background2",
            alignSelf: "flex-start",

            position: "absolute",
            width: "64rem",
            top: "12rem",
            margin: "0 auto",
            flex: 0,
            background: "background",
            boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            zIndex: 9,
          }}
          role="menu"
        >
          <Heading variant="heading3">
            You're in {currentWaypoint} -
            <Text
              sx={{
                display: "inline-flex",
              }}
            >
              In Teristraz
            </Text>
          </Heading>

          <Flex
            sx={{
              gap: "3.2rem",
              flexDirection: "column",
              alignItems: "center",

              "@media (min-width: 768px)": {
                flexDirection: "row",
                alignItems: "flex-start",
              },
            }}
          >
            <Flex
              sx={{
                flexDirection: "column",
                gap: ".8rem",
              }}
            >
              <Link passHref href="/play">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_bank.png"
                  />
                  {/* <DotsIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                  Bank
                </ThemeLink>
              </Link>
              <Link passHref href="/play?waypoint=dungeons">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_quests.png"
                  />
                  {/* <DotsIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                  Dungeons
                </ThemeLink>
              </Link>
              <Link passHref href="/play">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
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
                </ThemeLink>
              </Link>
              <Link passHref href="/play">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
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
                </ThemeLink>
              </Link>

              <Link passHref href="/play">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
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
                </ThemeLink>
              </Link>
              <Link passHref href="/play">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_temple.png"
                  />
                  {/* <WildernessIcon
                        sx={{
                          width: "2.4rem",
                          height: "2.4rem",
                        }}
                      />{" "} */}
                  Temple
                </ThemeLink>
              </Link>
              <Link passHref href="/play?waypoint=wilderness">
                <ThemeLink variant="gameButton">
                  <img
                    sx={{
                      maxWidth: "2.4rem",
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
                </ThemeLink>
              </Link>
            </Flex>
            {currentWaypoint ? <WaypointComponent /> : null}
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

      {/** Background Blur */}
      <div
        sx={{
          "::before": {
            content: "''",
            position: "fixed",
            backgroundColor: "background",
            zIndex: 8,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 0.3,
          },
        }}
      ></div>
    </Flex>
  )
}
