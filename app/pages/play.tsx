/** @jsxImportSource theme-ui */
import {
  Heading,
  Text,
  Button,
  Flex,
  Link as ThemeLink,
  Slider,
} from "@theme-ui/components"

import WalletConnectButton from "@/components/WalletConnectButton"

import useWalletWrapper from "@/hooks/useWalletWrapper"
import WalletManager from "@/components/WalletManager/WalletManager"
import Link from "next/link"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useCallback, useContext, useEffect, useRef, useState } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { ArrowLeftIcon, SettingsIcon, ShirtIcon } from "@/components/icons"
import WayPoints from "components/Waypoints"
import { useRouter } from "next/router"
import { Modal } from "@/components/Modal/Modal"

const DEFAULT_BACKGROUND_VOLUME = 0.4
const DEFAULT_EFFECTS_VOLUME = 0.2

export default function Play() {
  const { publicKey, isWalletReady } = useWalletWrapper()
  const { selectedCharacter, isLoading: isCharacterLoading } =
    useContext(characterContext)
  const { query } = useRouter()
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [audioVolume, setAudioVolume] = useState(DEFAULT_BACKGROUND_VOLUME)
  const effectsAudioRef = useRef<HTMLAudioElement>()
  const backgroundAudioRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    if (
      backgroundAudioRef.current &&
      backgroundAudioRef.current.volume !== audioVolume
    ) {
      backgroundAudioRef.current.volume = audioVolume
    }
  }, [audioVolume])

  /** Callback used to store the reference to the audio element. */
  const backgroundRefCallback = useCallback((node: HTMLAudioElement) => {
    if (node !== null && node.volume !== DEFAULT_BACKGROUND_VOLUME) {
      /** Set default volume on mount */
      node.volume = DEFAULT_BACKGROUND_VOLUME
      node.play()

      backgroundAudioRef.current = node
    }
  }, [])

  /** Callback used to store the reference to the audio element. */
  const effectsRefCallback = useCallback((node) => {
    if (node !== null && node.volume !== DEFAULT_EFFECTS_VOLUME) {
      /** Set default volume on mount */
      node.volume = DEFAULT_EFFECTS_VOLUME
      effectsAudioRef.current = node
    }
  }, [])

  const handleEffectsAudioPlay = () => {
    if (effectsAudioRef.current) {
      effectsAudioRef.current.pause()
      effectsAudioRef.current.currentTime = 0
      effectsAudioRef.current.play()
    }
  }

  /** Add wallet loading before anything else to prevent flash of content. */
  if (!isWalletReady) {
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

  /**
   * Only a verbose way to render the character JSX elements.
   */
  const renderCharacterHeaderContent = () => {
    /** Wallet is not connected */
    if (!isWalletConnected) {
      return (
        <>
          Please, connect your wallet first:
          <WalletConnectButton label={<Button>Connect</Button>} />
        </>
      )
    }

    if (isCharacterLoading) {
      return <LoadingIcon />
    }

    if (selectedCharacter) {
      return (
        <>
          <Flex
            mb=".8rem"
            sx={{
              alignItems: "center",
            }}
          >
            <img
              sx={{
                maxWidth: "6.4rem",
                borderRadius: ".4rem",
              }}
              src={selectedCharacter.nft.json.image}
            />
            <Heading mb=".8rem" ml=".8rem" variant="heading1">
              {selectedCharacter.account.name.toString()}
            </Heading>
          </Flex>
          <Flex
            sx={{
              flexDirection: "column",
            }}
          >
            <Flex
              sx={{
                flexDirection: "column",
                maxWidth: "20rem",
              }}
            >
              <Flex
                mb=".4rem"
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "5rem",
                }}
              >
                <Text>Attribute</Text>
                <Text>Value</Text>
              </Flex>
              <Flex
                sx={{
                  flexDirection: "column",
                  gap: ".4rem",
                }}
              >
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text variant="small" color="lightText">
                    Experience
                  </Text>
                  <Text variant="small">
                    {selectedCharacter.account.experience.toString()}
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text variant="small" color="lightText">
                    Hitpoints
                  </Text>
                  <Text variant="small">
                    {selectedCharacter.account.hitpoints.toString()}
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text variant="small" color="lightText">
                    Deaths
                  </Text>
                  <Text variant="small">
                    {selectedCharacter.account.deaths.toString()}
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text variant="small" color="lightText">
                    Melee Skill
                  </Text>
                  <Text variant="small">
                    {selectedCharacter.account.meleeSkill.toString()}
                  </Text>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "5rem",
                  }}
                >
                  <Text variant="small" color="lightText">
                    In Quest
                  </Text>
                  <Text variant="small">
                    {selectedCharacter.account.questState ? "true" : "false"}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )
    }

    /**
     * If the character is not loading, and it is not selected,
     * it means the user doesn't have any character.
     */
    if (!isCharacterLoading && !selectedCharacter) {
      return (
        <Text
          sx={{
            alignItems: "center",
          }}
        >
          Please, <br />
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
  }

  const isWalletConnected = isWalletReady && publicKey

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
            flexDirection: "column",
            border: "1px solid",
            borderColor: "background2",
            alignSelf: "flex-start",

            position: "fixed",
            margin: "auto",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            background: "background",
            boxShadow: "0px 4px 4px rgba(0,0,0,0.25)",
            zIndex: 9,

            "@media (min-width: 768px)": {
              width: "96rem",
            },
          }}
        >
          <Flex
            sx={{
              gap: "3.2rem",
              flexDirection: "column",
              alignItems: "stretch",

              "@media (min-width: 768px)": {
                flexDirection: "row",
              },
            }}
          >
            <Flex
              sx={{
                flexDirection: "column",
                alignItems: "stretch",
                padding: "3.2rem 1.6rem",
                background: "rgb(29, 24, 24)",

                "@media (min-width: 768px)": {
                  maxWidth: "24rem",
                },
              }}
            >
              <Flex sx={{ alignItems: "flex-start", marginBottom: "1.6rem" }}>
                <Flex
                  sx={{
                    flexDirection: "column",
                  }}
                >
                  {renderCharacterHeaderContent()}
                </Flex>

                <Button
                  variant="resetted"
                  tabIndex={1}
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <SettingsIcon />
                </Button>
                {isSettingsModalOpen ? (
                  <Modal
                    sx={{
                      maxWidth: "64rem",
                    }}
                    isOpen={isSettingsModalOpen}
                    setIsOpen={setIsSettingsModalOpen}
                  >
                    <Flex
                      sx={{
                        alignItems: "center",
                        flexDirection: "column",
                        padding: ".8rem 0",
                        gap: "1.6rem",
                      }}
                    >
                      <Heading variant="heading3">Wallet</Heading>
                      <WalletManager />
                      <br />
                      <Heading variant="heading3">Sound</Heading>
                      <Slider
                        sx={{
                          maxWidth: "16rem",
                        }}
                        defaultValue={audioVolume * 100}
                        onChange={(e) =>
                          setAudioVolume(Number(e.target.value) / 100)
                        }
                      />
                    </Flex>
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
                          Log out
                        </a>
                      </Link>
                    </Flex>
                  </Modal>
                ) : null}
              </Flex>

              <Flex
                sx={{
                  flexDirection: "column",
                  gap: ".8rem",
                  flex: "0 20%",
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
            </Flex>
            <Flex
              sx={{
                flex: "1 auto",
                flexDirection: "column",
                padding: "3.2rem 1.6rem",
              }}
            >
              {currentWaypoint ? <WaypointComponent /> : null}
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
          <img
            sx={{
              opacity: 0.6,
            }}
            src="/assets/teristraz.png"
          />
        </Flex>
      </Flex>

      {/** Audio stuff */}

      <audio id="player" autoPlay loop ref={backgroundRefCallback}>
        <source src="/assets/village_loop.wav" type="audio/mp3" />
      </audio>

      <audio id="player" ref={effectsRefCallback}>
        <source src="/assets/typingsfx_sound.wav" type="audio/mp3" />
      </audio>
    </Flex>
  )
}
