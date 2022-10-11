/** @jsxImportSource theme-ui */
import { Heading, Text, Label, Input, Button } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import NFTSelectInput from "@/components/NFTSelectInput/NFTSelectInput"
import useWalletNFTs from "@/hooks/useWalletNFTs"
import { FormEvent } from "react"
import { createCharacter } from "lib/gen/instructions"
import { PROGRAM_ID } from "lib/gen/programId"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import {
  getCharacterAddress,
  getTokenMetadataAddress,
  TOKEN_METADATA_PROGRAM_ID,
} from "lib/utils"
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token"

const systemProgram = web3.SystemProgram.programId

export default function Create() {
  const { walletNFTs } = useWalletNFTs()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)

    const mint = new web3.PublicKey(
      "Gg3VDgXUqRecKUhgDaMEhzhVX2ywtLmL8pU9oXZJiUZQ"
    )

    const character = getCharacterAddress(publicKey, mint, PROGRAM_ID)

    const ix = createCharacter(
      {
        name: "test",
      },
      {
        character,
        owner: publicKey,
        systemProgram,
        ownerTokenAccount: await associatedAddress({ mint, owner: publicKey }),
        nftMint: mint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenMetadata: getTokenMetadataAddress(mint),
      }
    )

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
          Create a character
        </Heading>
        <Text mb="3.2rem">Create now</Text>

        {walletNFTs ? (
          <form
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1.6rem",
            }}
            onSubmit={onSubmit}
          >
            <Label
              sx={{
                flexDirection: "column",
              }}
            >
              Choose a name:
              <Input name="name" />
            </Label>
            <Label
              sx={{
                flexDirection: "column",
              }}
            >
              Select an NFT of yours:
              <NFTSelectInput name="NFT" NFTs={walletNFTs} />
            </Label>
            <Button>Create</Button>
          </form>
        ) : null}
      </main>
    </>
  )
}
