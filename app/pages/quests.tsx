/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getQuests } from "lib/utils"
import { QuestAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { joinQuest } from "lib/gen/instructions"
import NFTSelectInput from "@/components/NFTSelectInput/NFTSelectInput"
import useWalletNFTs from "@/hooks/useWalletNFTs"

type QuestResponse = {
  pubkey: web3.PublicKey
  account: QuestAccount
}

export default function Quests() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const { walletNFTs } = useWalletNFTs()
  const [quests, setQuests] = useState<QuestResponse[]>(null)

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

    const nftMint = new web3.PublicKey(data.get("mint").toString())

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
    <>
      <Header />
      <main
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "64rem",
          margin: "0 auto",
          marginTop: "4rem",
          padding: "0 1.6rem",
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
          }}
        >
          {quests ? (
            quests.map((quest) => {
              return (
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                  }}
                  key={quest.pubkey.toString()}
                >
                  {/* <img
                    sx={{
                      maxWidth: "6.4rem",
                      borderRadius: ".4rem",
                    }}
                    src={quest.}
                  /> */}
                  <Flex
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      borderTop: "1px solid",
                      borderBottom: "1px solid",
                      borderColor: "primary",
                      padding: ".8rem 0",
                    }}
                  >
                    <Text>{quest.pubkey.toString()}</Text>
                    <Text>
                      Reward Exp: +{quest.account.config.rewardExp.toNumber()}
                    </Text>
                    <Text>
                      Duration: {quest.account.config.duration.toNumber()}s
                    </Text>
                    <form onSubmit={handleJoinFormSubmit}>
                      <input
                        type="hidden"
                        name="uuid"
                        value={quest.account.config.uuid.toString()}
                      />
                      <NFTSelectInput name="mint" NFTs={walletNFTs} />
                      <Button type="submit" mt="1.6rem">
                        Join
                      </Button>
                    </form>
                  </Flex>
                </Flex>
              )
            })
          ) : (
            <LoadingIcon />
          )}
        </Flex>
      </main>
    </>
  )
}
