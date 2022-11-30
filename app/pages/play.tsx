/** @jsxImportSource theme-ui */
import {
  Heading,
  Text,
  Button,
  Flex,
  Link as ThemeLink,
} from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"

import useWalletWrapper from "@/hooks/useWalletWrapper"
import WalletManager from "@/components/WalletManager/WalletManager"
import Link from "next/link"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useContext, useEffect, useRef, useState } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { ArrowLeftIcon, BackIcon, WildernessIcon } from "@/components/icons"
import WayPoints from "components/Waypoints"
import { useRouter } from "next/router"

export default function Play() {
  const { publicKey, wallet, autoConnect, isWalletReady } = useWalletWrapper()
  const { selectedCharacter, characters, setSelectedCharacter, isLoading } =
    useContext(characterContext)
  const { query } = useRouter()
  const backgroundAudioRef = useRef<HTMLAudioElement>(null)
  const effectsAudioRef = useRef<HTMLAudioElement>(null)
  const [isModalOpen, setIsModalOpen] = useState(true)

  // const isOnboarding = !localStorage.getItem('onboardDone')

  useEffect(() => {
    if (backgroundAudioRef.current) {
      if (backgroundAudioRef.current.volume !== 0.4) {
        backgroundAudioRef.current.volume = 0.4
      }
    }
  }, [backgroundAudioRef])

  useEffect(() => {
    if (effectsAudioRef.current) {
      if (effectsAudioRef.current.volume !== 0.2) {
        effectsAudioRef.current.volume = 0.2
      }
    }
  }, [effectsAudioRef.current])

  const handleModalToggle = () => {
    // setIsModalOpen((prev) => !prev)
  }

  const handleEffectsAudioPlay = () => {
    if (effectsAudioRef.current) {
      effectsAudioRef.current.pause()
      effectsAudioRef.current.currentTime = 0
      effectsAudioRef.current.play()
    }
  }

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
      {/* <Flex
        sx={{
          background: "background2",
          zIndex: 10,
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
           
            </Heading>
          </Flex>
          <Text
            sx={{
              color: "#4bd84b",
              display: "none",

              "@media (min-width: 768px)": {
                display: "flex",
              },
            }}
            variant="xsmall"
          >
            &#8226;&nbsp;21 players online
          </Text>
          <WalletManager />
        </Flex>
      </Flex> */}

      {/* <Heading
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
          {selectedCharacter && selectedCharacter?.account?.name}. You're in
          Teristraz
        </Text>
      </Heading> */}

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
        {/** Waypoints modal */}
        <Flex
          sx={{
            display: isModalOpen ? "flex" : "none",

            flexDirection: "column",
            padding: "1.6rem",
            listStyle: "none",
            gap: "1.6rem",
            borderRight: "1px solid",
            borderColor: "background2",
            alignSelf: "flex-start",

            position: "absolute",
            top: "12rem",
            margin: "0 auto",
            flex: 0,
            background: "background",
            boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            zIndex: 9,

            "@media (min-width: 768px)": {
              minWidth: "64rem",
            },
          }}
        >
          <Heading variant="heading3">
            You're&nbsp;
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
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
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
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                >
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
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
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
              <Link passHref href="/play?waypoint=wilderness">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                >
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_wilderness.png"
                  />
                  Hunts
                </ThemeLink>
              </Link>
              <Link passHref href="/play">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
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
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
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
              <Link passHref href="/play?waypoint=spawns">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                >
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_wilderness.png"
                  />
                  Spawns
                </ThemeLink>
              </Link>
              <Link passHref href="/play">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
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
              <Link passHref href="/play">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                  sx={{
                    opacity: 0.5,
                    pointerEvents: "none",
                  }}
                >
                  <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_train.png"
                  />
                  Trainer
                </ThemeLink>
              </Link>
              <Link passHref href="/play?waypoint=monsters">
                <ThemeLink
                  variant="gameButton"
                  onClick={handleEffectsAudioPlay}
                >
                  {/* <img
                    sx={{
                      maxWidth: "2.4rem",
                    }}
                    src="/assets/icon_wilderness.png"
                  /> */}
                  Monsters
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
          <img
            sx={{
              cursor: "pointer",
            }}
            onClick={handleModalToggle}
            src="/assets/teristraz.png"
          />
        </Flex>
      </Flex>

      {/** Background Blur */}
      <div
        onClick={handleModalToggle}
        sx={{
          display: isModalOpen ? "block" : "none",
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

      {/** Audio stuff */}

      <audio id="player" autoPlay loop ref={backgroundAudioRef}>
        <source src="/assets/village_loop.wav" type="audio/mp3" />
      </audio>

      <audio id="player" ref={effectsAudioRef}>
        <source src="/assets/typingsfx_sound.wav" type="audio/mp3" />
      </audio>
    </Flex>
  )
}
