/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getQuests } from "lib/program-utils"
import { QuestAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { joinQuest } from "lib/gen/instructions"
import NFTSelectInput from "@/components/NFTSelectInput/NFTSelectInput"
import useWalletNFTs from "@/hooks/useWalletNFTs"
import questsData from "lib/quests.json"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { Layout } from "@/components/Layout/Layout"

type QuestResponse = {
  pubkey: web3.PublicKey
  account: QuestAccount
}

export default function Quests() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { walletNFTs } = useWalletNFTs()
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

    const uuid = data.get("uuid").toString()

    const quest = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("quest"), Buffer.from(uuid)],
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
    <Layout>
      <Heading mb=".8rem" variant="heading1">
        Quests
      </Heading>
      <Text mb="3.2rem">List of created Quests</Text>

      <Flex
        sx={{
          flexDirection: "column",
          gap: "1.6rem",
        }}
      >
        {quests ? (
          quests.map((quest) => {
            const questData = questsData.find(
              (questData) => questData.uuid === quest.account.config.uuid
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
                    maxWidth: "32rem",
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
                  <Text>
                    Reward Exp: +{quest.account.config.rewardExp.toNumber()}
                  </Text>
                  <Text>
                    Duration: {quest.account.config.duration.toNumber()}s
                  </Text>
                </Flex>
                <form sx={{}} onSubmit={handleJoinFormSubmit}>
                  <input
                    type="hidden"
                    name="uuid"
                    value={quest.account.config.uuid.toString()}
                  />
                  <Button type="submit" mt="1.6rem">
                    Join
                  </Button>
                </form>
              </Flex>
            )
          })
        ) : (
          <LoadingIcon />
        )}
      </Flex>
    </Layout>
  )
}
