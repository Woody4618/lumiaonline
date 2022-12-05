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
import { ArrowLeftIcon, SettingsIcon } from "@/components/icons"
import WayPoints from "components/Waypoints"
import { useRouter } from "next/router"
import { Modal } from "@/components/Modal/Modal"

export default function Play() {
  const { publicKey, isWalletReady } = useWalletWrapper()
  const { selectedCharacter, isLoading } = useContext(characterContext)
  const { query } = useRouter()
  const backgroundAudioRef = useRef<HTMLAudioElement>(null)
  const effectsAudioRef = useRef<HTMLAudioElement>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

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
      <Flex
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          maxWidth: "64rem",
          margin: "0 auto",
          alignSelf: "stretch",
          justifyContent: "flex-end",
          padding: "1.6rem 0",
          minHeight: "6.4rem",
          zIndex: 10,
        }}
      >
        <a onClick={() => setIsSettingsModalOpen(true)}>
          <SettingsIcon />
        </a>
        <Modal isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen}>
          <Flex
            sx={{
              alignItems: "center",
              flexDirection: "column",
              padding: ".8rem 0",
              gap: "1.6rem",
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
                    gap: ".8rem",
                  }}
                >
                  <ArrowLeftIcon
                    sx={{
                      width: "2.4rem",
                      height: "2.4rem",
                    }}
                  />
                  Return to home
                </a>
              </Link>
            </Flex>
            <WalletManager />
          </Flex>
        </Modal>
      </Flex>

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
        <Modal isOpen={true}>
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
            </Flex>
            {currentWaypoint ? <WaypointComponent /> : null}
          </Flex>
        </Modal>
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
            src="/assets/teristraz.png"
          />
        </Flex>
      </Flex>

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
