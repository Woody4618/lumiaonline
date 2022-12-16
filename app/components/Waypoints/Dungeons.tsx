/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getQuests } from "lib/program-utils"
import { QuestAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { joinQuest } from "lib/gen/instructions"
import { quests as questsData } from "data/quests"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"

type QuestResponse = {
  pubkey: web3.PublicKey
  account: QuestAccount
}

export function Dungeons() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [quests, setQuests] = useState<QuestResponse[]>(null)
  const { selectedCharacter } = useContext(characterContext)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const quests = await getQuests(connection)

        console.log(quests)
        setQuests(quests)
      }
    })()
  }, [connection])

  const handleJoinFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
    console.log(txid)
  }

  return (
    <Flex
      sx={{
        flexDirection: "column",
      }}
    >
      <Heading mb=".8rem" variant="heading1">
        Quests
      </Heading>
      <Text mb="3.2rem">List of created Quests</Text>

      <Flex
        sx={{
          flexDirection: "column",
          gap: "1.6rem",

          "@media (min-width: 768px)": {
            maxHeight: "70vh",
            overflowY: "scroll",
          },
        }}
      >
        {quests ? (
          quests.map((quest) => {
            const questData = questsData.find(
              (questData) => questData.id === quest.account.id
            )
            return (
              <Flex
                sx={{
                  alignItems: "center",
                  flexDirection: "column",
                  gap: ".8rem",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "primary",
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
                </Flex>
                <form sx={{}} onSubmit={handleJoinFormSubmit}>
                  <input
                    type="hidden"
                    name="id"
                    value={quest.account.id.toString()}
                  />
                  <Button type="submit" mt="1.6rem">
                    Join
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
    </Flex>
  )
}
