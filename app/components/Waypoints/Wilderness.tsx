/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3, BN } from "@project-serum/anchor"
import {
  getCharacterAddress,
  getMonsters,
  getParsedIx,
} from "lib/program-utils"
import { CharacterAccount, MonsterTypeAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { monsters as monstersData } from "data/monsters"
import toast from "react-hot-toast"
import { useContext } from "react"
import { characterContext } from "contexts/CharacterContextProvider"
import { Layout } from "@/components/Layout/Layout"

type MonsterResponse = {
  pubkey: web3.PublicKey
  account: MonsterTypeAccount
}

export function Wilderness() {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()
  const [monsters, setMonsters] = useState<MonsterResponse[]>(null)

  // const [characterSubscriptionId, setCharacterSubscriptionId] =
  //   useState<string>()
  const { selectedCharacter } = useContext(characterContext)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const monsters = await getMonsters(connection)

        console.log(monsters)
        setMonsters(monsters)

        /** Create character account subscription */
        // if (!characterSubscriptionId) {
        //   console.log("creating subscription...")
        //   /** Add listener for character acc */
        //   const subscriptionId = connection.onAccountChange(character, (acc) => {
        //     console.log(acc)
        //     const decoded = CharacterAccount.decode(acc.data)
        //     console.log(decoded)

        //     // @TODO: verify if the character won or lost the battle.
        //   })

        //   console.log(subscriptionId)
        //   setCharacterSubscriptionId(subscriptionId.toString())
        //   // connection.removeSlotUpdateListener(subscriptionId)
        // }
      }
    })()
  }, [connection])

  const handleJoinFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const monsterUuid = data.get("uuid").toString()
    if (!selectedCharacter) throw new Error("Select a character first")
    const nftMint = selectedCharacter.nft.mint.address

    const character = getCharacterAddress(publicKey, nftMint, PROGRAM_ID)
    const monster = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("monster"), Buffer.from(monsterUuid)],
      PROGRAM_ID
    )[0]

    const rawTx = await (
      await fetch(
        `/api/join-battle-ix?${new URLSearchParams({
          character: character.toString(),
          monster: monster.toString(),
          owner: publicKey.toString(),
        })}`,
        {
          method: "GET",
        }
      )
    ).json()

    const tx = web3.Transaction.from(rawTx.data)

    const loadingToast = toast.loading("Awaiting approval...")
    const txid = await sendTransaction(tx, connection)

    toast.loading("Confirming transaction...", {
      id: loadingToast,
    })

    const previousCharacterAccount = CharacterAccount.decode(
      (await connection.getAccountInfo(character)).data
    )

    const latest = await connection.getLatestBlockhash("confirmed")
    await connection.confirmTransaction({
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
      signature: txid,
    })

    const newCharacterAcc = CharacterAccount.decode(
      (await connection.getAccountInfo(character)).data
    )

    if (newCharacterAcc.deaths > previousCharacterAccount.deaths) {
      toast.error("died ", {
        id: loadingToast,
      })
    } else {
      toast.success("won", {
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
        Wilderness
      </Heading>

      <Text my="3.2rem"></Text>
      <Flex
        sx={{
          flexDirection: "column",
        }}
      >
        <Text>Rotworm Cave</Text>
        <Text>Distance: 520m</Text>
        <Text>Creatures: 5 Rotworm</Text>
        <Text>Recommended lvl: 9</Text>
        <Flex>
          <Button>Start Solo</Button>
          <Button>Join Party</Button>
        </Flex>
      </Flex>

      <Flex
        sx={{
          flexDirection: "column",
          marginTop: "1.6rem",
        }}
      >
        <Text>Elven Fortress</Text>
        <Text>Distance: 1320m</Text>
        <Text>Creatures: 7 Elf, 3 Elf Arcanist</Text>
        <Text>Recommended lvl: 15</Text>
      </Flex>
    </Flex>
  )
}
