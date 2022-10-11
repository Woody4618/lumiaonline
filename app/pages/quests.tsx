/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { useEffect, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getQuests } from "lib/utils"
import { QuestAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"

type QuestResponse = {
  pubkey: web3.PublicKey
  account: QuestAccount
}

export default function Quests() {
  const { connection } = useConnection()
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
                    <Button mt="1.6rem">Join</Button>
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
