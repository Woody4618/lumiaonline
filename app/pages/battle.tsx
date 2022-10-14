/** @jsxImportSource theme-ui */
import { Heading, Text, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { FormEvent, useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getCharacterAddress, getMonsters } from "lib/program-utils"
import { CharacterAccount, MonsterAccount } from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { PROGRAM_ID } from "lib/gen/programId"
import { joinBattle } from "lib/gen/instructions"
import NFTSelectInput from "@/components/NFTSelectInput/NFTSelectInput"
import useWalletNFTs from "@/hooks/useWalletNFTs"
import monstersData from "lib/monsters.json"
import toast from "react-hot-toast"

type MonsterResponse = {
  pubkey: web3.PublicKey
  account: MonsterAccount
}

export default function Battle() {
  const { connection } = useConnection()
  const { publicKey, signTransaction } = useWallet()
  const { walletNFTs } = useWalletNFTs()
  const [monsters, setMonsters] = useState<MonsterResponse[]>(null)
  const [selectedMint, setSelectedMint] = useState<string>()
  // const [characterSubscriptionId, setCharacterSubscriptionId] =
  //   useState<string>()

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

    const nftMint = new web3.PublicKey(selectedMint)

    const character = getCharacterAddress(publicKey, nftMint, PROGRAM_ID)

    const uuid = data.get("uuid").toString()

    const monster = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("monster"), Buffer.from(uuid)],
      PROGRAM_ID
    )[0]

    const ix = joinBattle({
      monster,
      character,
      clock: web3.SYSVAR_CLOCK_PUBKEY,
    })

    const latest = await connection.getLatestBlockhash()
    const tx = new web3.Transaction()

    tx.recentBlockhash = latest.blockhash
    tx.feePayer = publicKey
    tx.add(ix)

    const loadingToast = toast.loading("Awaiting approval...")
    const signedtx = await signTransaction(tx)

    const body = {
      tx: signedtx.serialize({
        /** Bypass validation since we don't have the authority signature yet */
        requireAllSignatures: false,
        verifySignatures: true,
      }),
    }

    toast.loading("Sending transaction...", {
      id: loadingToast,
    })

    const { txid } = await (
      await fetch("/api/battle", {
        method: "POST",
        body: JSON.stringify(body),
      })
    ).json()

    const previousCharacterAccount = CharacterAccount.decode(
      (await connection.getAccountInfo(character)).data
    )

    await connection.confirmTransaction({
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
      signature: txid,
    })

    const newCharacterAcc = CharacterAccount.decode(
      (await connection.getAccountInfo(character)).data
    )

    if (
      newCharacterAcc.deaths.length > previousCharacterAccount.deaths.length
    ) {
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
          Battle
        </Heading>
        <Text mb="3.2rem">Select your character and a monster to battle</Text>

        <NFTSelectInput
          onChange={(newValue) => {
            setSelectedMint(newValue.value)
          }}
          name="mint"
          NFTs={walletNFTs}
        />
        <Text my="3.2rem"></Text>
        <Flex
          sx={{
            gap: "1.6rem",
          }}
        >
          {monsters ? (
            monsters.map((monster) => {
              const monsterData = monstersData.find(
                (monsterData) =>
                  monsterData.name === monster.account.config.uuid
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
                  key={monster.pubkey.toString()}
                >
                  <Heading variant="heading2">{monsterData.name}</Heading>
                  <img
                    sx={{
                      maxWidth: "8rem",
                      borderRadius: ".4rem",
                    }}
                    src={monsterData.image}
                  />

                  <Flex
                    sx={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* <Text>
                      Hitpoints: {monster.account.config.hitpoints.toNumber()}
                    </Text> */}
                  </Flex>
                  <form sx={{}} onSubmit={handleJoinFormSubmit}>
                    <input
                      type="hidden"
                      name="uuid"
                      value={monster.account.config.uuid.toString()}
                    />
                    <Button type="submit" mt="1.6rem">
                      Battle
                    </Button>
                  </form>
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
