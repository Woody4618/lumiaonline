/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import {
  FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getQuests } from "lib/program-utils"
import { QuestAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { claimQuest, joinQuest } from "lib/gen/instructions"
import { quests as missionsData } from "data/quests"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { toast } from "react-hot-toast"
import { fromTxError } from "lib/gen/errors"
import { count } from "console"
import { ProgressBar } from "../ProgressBar/ProgressBar"

type MissionResponse = {
  pubkey: web3.PublicKey
  account: QuestAccount
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

function useInterval(callback: () => void, delay: number) {
  const savedCallback = useRef(callback)
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    if (!delay && delay !== 0) {
      return
    }
    const id = setInterval(() => savedCallback.current(), delay)
    return () => clearInterval(id)
  }, [delay])
}

export function Missions() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [missions, setMissions] = useState<MissionResponse[]>(null)
  const { selectedCharacter, fetchCharacters } = useContext(characterContext)
  const [questProgress, setQuestProgress] = useState<{
    questId: string
    time: number
  }>({ questId: null, time: null })

  const fetchMissions = useCallback(async () => {
    const missions = await getQuests(connection)

    setMissions(missions)
  }, [connection])

  useEffect(() => {
    ;(async () => {
      if (connection) {
        fetchMissions()
      }
    })()
  }, [connection])

  const handleJoinFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const loadingToast = toast.loading("Joining mission...")

    try {
      const data = new FormData(e.currentTarget)

      if (!selectedCharacter) throw new Error("Select a character first")
      const nftMint = selectedCharacter.nft.mint.address

      const character = getCharacterAddress(publicKey, nftMint, PROGRAM_ID)

      const id = data.get("id").toString()

      const quest = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(id)],
        PROGRAM_ID
      )[0]

      const ix = joinQuest({
        quest,
        character,
        nftMint,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        owner: publicKey,
      })

      const latest = await connection.getLatestBlockhash()
      const tx = new web3.Transaction()

      tx.recentBlockhash = latest.blockhash
      tx.add(ix)

      const txid = await sendTransaction(tx, connection)

      await connection.confirmTransaction({
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
        signature: txid,
      })

      await fetchCharacters()

      toast.success(`Joined!`, {
        id: loadingToast,
      })
    } catch (e) {
      const msg = fromTxError(e) || e

      toast(msg + "", {
        id: loadingToast,
      })
    }
  }

  const handleClaimFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const loadingToast = toast.loading("Claiming...")

    try {
      const data = new FormData(e.currentTarget)

      if (!selectedCharacter) throw new Error("Select a character first")
      const nftMint = selectedCharacter.nft.mint.address

      const character = getCharacterAddress(publicKey, nftMint, PROGRAM_ID)

      const id = data.get("id").toString()

      const quest = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(id)],
        PROGRAM_ID
      )[0]

      const ix = claimQuest({
        quest,
        character,
        nftMint,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        owner: publicKey,
      })

      const latest = await connection.getLatestBlockhash()
      const tx = new web3.Transaction()

      tx.recentBlockhash = latest.blockhash
      tx.add(ix)

      const txid = await sendTransaction(tx, connection)

      await connection.confirmTransaction({
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
        signature: txid,
      })

      await fetchCharacters()

      toast.success(`Reward claimed!`, {
        id: loadingToast,
      })
    } catch (e) {
      const msg = fromTxError(e) || e

      toast(msg + "", {
        id: loadingToast,
      })
    }
  }

  const currentCharacterMissionData = useMemo(() => {
    if (!selectedCharacter) return null

    const characterQuestId = selectedCharacter?.account.questState?.questId
    if (characterQuestId) {
      const questData = missionsData.find(
        (questData) => questData.id === characterQuestId
      )
      return questData
    }
  }, [selectedCharacter])

  useInterval(async () => {
    if (missions.length > 0) {
      const timeLeftForMission = currentCharacterMissionData
        ? selectedCharacter?.account.questState?.startedAt.toNumber() +
          currentCharacterMissionData?.duration -
          new Date().getTime() / 1000
        : null

      timeLeftForMission
        ? setQuestProgress({
            questId: currentCharacterMissionData.id,
            time: timeLeftForMission,
          })
        : null
    }
  }, 1000)

  return (
    <>
      <Flex
        sx={{
          flexDirection: "column",
          gap: "3.2rem",

          "@media (min-width: 768px)": {
            flexDirection: "row",
          },
        }}
      >
        {missions ? (
          missions.map((quest) => {
            const questData = missionsData.find(
              (questData) => questData.id === quest.account.id
            )
            const isQuestInProgress =
              currentCharacterMissionData?.id === questData?.id
            return (
              <Flex
                sx={{
                  alignItems: "flex-start",
                  flexDirection: "column",
                  gap: ".8rem",
                  padding: ".8rem 0",
                }}
                key={quest.pubkey.toString()}
              >
                <Heading variant="heading2">{questData.name}</Heading>
                <img
                  sx={{
                    maxWidth: "16rem",
                    borderRadius: ".4rem",
                  }}
                  src={questData.image}
                />
                <Text
                  sx={{
                    maxWidth: "32rem",
                  }}
                >
                  {questData.description}
                </Text>
                <Flex
                  sx={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    margin: "3.2rem 0",
                  }}
                >
                  <Text>Reward Exp: +{quest.account.rewardExp.toNumber()}</Text>
                  <Text>Duration: {quest.account.duration.toNumber()}s</Text>

                  {isQuestInProgress ? (
                    <>
                      <br />
                      <Text>You have accepted this mission.</Text>
                      <Text>
                        Started:{" "}
                        {new Date(
                          selectedCharacter.account.questState?.startedAt.toNumber() *
                            1000
                        ).toDateString()}
                      </Text>
                      <Text>
                        Time Left:{" "}
                        {Number(questProgress.time?.toFixed(2)) < 0
                          ? "done"
                          : questProgress.time?.toFixed(2)}
                        <ProgressBar
                          value={Number(questProgress.time?.toFixed(2))}
                          maxvalue={currentCharacterMissionData?.duration}
                          type={"mission"}
                        />
                      </Text>
                    </>
                  ) : null}
                </Flex>
                <form
                  sx={{}}
                  onSubmit={
                    isQuestInProgress
                      ? handleClaimFormSubmit
                      : handleJoinFormSubmit
                  }
                >
                  <input
                    type="hidden"
                    name="id"
                    value={quest.account.id.toString()}
                  />
                  <Button type="submit">
                    {isQuestInProgress ? "Claim" : "Accept Mission"}
                  </Button>
                </form>
              </Flex>
            )
          })
        ) : (
          <Text
            sx={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LoadingIcon />
          </Text>
        )}
      </Flex>
    </>
  )
}
