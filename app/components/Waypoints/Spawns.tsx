/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getSpawnInstances } from "lib/program-utils"
import { MonsterTypeAccount, MonsterSpawnAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { killSpawn } from "lib/gen/instructions"
import { PublicKey } from "@solana/web3.js"

type SpawnInstanceResponse = {
  pubkey: web3.PublicKey
  account: MonsterSpawnAccount
}

export function Spawns() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [spawnInstance, setSpawnInstance] =
    useState<SpawnInstanceResponse[]>(null)

  const { selectedCharacter } = useContext(characterContext)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const spawnInstance = await getSpawnInstances(connection)

        setSpawnInstance(spawnInstance)
      }
    })()
  }, [connection])

  const handleJoinFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const monsterTypeKey = new PublicKey(data.get("monster_type").toString())
    if (!selectedCharacter) throw new Error("Select a character first")

    const monster = await MonsterTypeAccount.fetch(connection, monsterTypeKey)

    const spawnInstance = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("spawn_instance"), Buffer.from(monster.name)],
      PROGRAM_ID
    )[0]

    const ix = killSpawn({
      spawnInstance,
      monsterType: monsterTypeKey,
      owner: publicKey,
      systemProgram: web3.SystemProgram.programId,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
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
        Spawns
      </Heading>

      <Text my="3.2rem"></Text>
      <Flex
        sx={{
          gap: "1.6rem",
        }}
      >
        {spawnInstance ? (
          spawnInstance.map(
            ({ account: { lastKilled, monsterType, spawntime }, pubkey }) => {
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
                  key={pubkey.toString()}
                >
                  <Heading variant="heading2">{monsterType.toString()}</Heading>
                  {/* <img
                  sx={{
                    maxWidth: "8rem",
                    borderRadius: ".4rem",
                  }}
                  src={spawnData.image}
                /> */}

                  <Flex
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* <Text>
                      Hitpoints: {monster.account.hitpoints.toNumber()}
                    </Text> */}
                  </Flex>
                  <form sx={{}} onSubmit={handleJoinFormSubmit}>
                    <input
                      type="hidden"
                      name="monster_type"
                      value={monsterType.toString()}
                    />
                    <Button type="submit" mt="1.6rem">
                      Kill
                    </Button>
                  </form>
                </Flex>
              )
            }
          )
        ) : (
          <LoadingIcon />
        )}
      </Flex>
    </Flex>
  )
}
