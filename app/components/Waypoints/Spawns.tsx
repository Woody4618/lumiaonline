/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import toast from "react-hot-toast"
import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getMonsterSpawns } from "lib/program-utils"
import {
  MonsterSpawnAccount,
  CharacterAccount,
  MonsterTypeAccount,
} from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { PublicKey } from "@solana/web3.js"

type SpawnInstanceResponse = {
  pubkey: web3.PublicKey
  account: MonsterSpawnAccount
  monster: MonsterTypeAccount
}

export function Spawns() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [monsterSpawns, setMonsterSpawns] =
    useState<SpawnInstanceResponse[]>(null)

  const { selectedCharacter } = useContext(characterContext)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const monsterSpawns = await getMonsterSpawns(connection)

        const withMonster = await Promise.all(
          monsterSpawns.map(async (spawn) => {
            const monster = await MonsterTypeAccount.fetch(
              connection,
              spawn.account.monsterType
            )

            const withMonster = Object.assign(spawn, {
              monster,
            })
            return withMonster
          })
        )

        setMonsterSpawns(withMonster)
      }
    })()
  }, [connection])

  const handleJoinFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const monsterTypeKey = new PublicKey(data.get("monster_type").toString())

    if (!selectedCharacter) throw new Error("Select a character first")

    const characterAddress = selectedCharacter.pubkey.toString()

    const rawTx = await (
      await fetch(
        `/api/join-battle-ix?${new URLSearchParams({
          characterAddress,
          monsterAddress: monsterTypeKey.toString(),
          owner: publicKey.toString(),
        })}`,
        {
          method: "GET",
        }
      )
    ).json()

    const tx = web3.Transaction.from(rawTx.data)

    const loadingToast = toast.loading("Awaiting approval...")

    try {
      const txid = await sendTransaction(tx, connection)

      toast.loading("Confirming transaction...", {
        id: loadingToast,
      })

      const characterPubKey = new PublicKey(characterAddress)
      const previousCharacterAccount = CharacterAccount.decode(
        (await connection.getAccountInfo(characterPubKey)).data
      )

      const latest = await connection.getLatestBlockhash("confirmed")
      await connection.confirmTransaction({
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
        signature: txid,
      })

      const newCharacterAcc = CharacterAccount.decode(
        (await connection.getAccountInfo(characterPubKey)).data
      )

      if (newCharacterAcc.deaths > previousCharacterAccount.deaths) {
        toast.error("Died ", {
          id: loadingToast,
        })
      } else {
        const monsterAcc = await MonsterTypeAccount.fetch(
          connection,
          monsterTypeKey
        )
        toast.success(`Won. +${monsterAcc.experience.toNumber()} exp`, {
          id: loadingToast,
        })
      }
    } catch (e) {
      console.log(e)
      toast.error(e + "", {
        id: loadingToast,
      })
    }
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

      {monsterSpawns ? (
        <Flex
          sx={{
            gap: "1.6rem",
          }}
        >
          {monsterSpawns.map(
            ({
              account: { lastKilled, spawntime, monsterType },
              monster,
              pubkey,
            }) => {
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
                  <Heading variant="heading2">{monster.name}</Heading>
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
                    <Text>Hitpoints: {monster.hitpoints.toNumber()}</Text>
                    <Text>meleeSkill: {monster.meleeSkill}</Text>
                    <Text>Spawntime: {spawntime.toNumber()}</Text>
                  </Flex>
                  <form sx={{}} onSubmit={handleJoinFormSubmit}>
                    <input
                      type="hidden"
                      name="monster_type"
                      value={monsterType.toString()}
                    />
                    <Button type="submit" mt="1.6rem">
                      Battle
                    </Button>
                  </form>
                </Flex>
              )
            }
          )}
        </Flex>
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
  )
}
