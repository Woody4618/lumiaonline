/** @jsxImportSource theme-ui */
import { Label, Input, Button } from "@theme-ui/components"

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
} from "lib/program-utils"
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token"
import WalletConnectButton from "@/components/WalletConnectButton"

const systemProgram = web3.SystemProgram.programId

export function CreateCharacterForm() {
  const { walletNFTs } = useWalletNFTs()
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = new FormData(e.currentTarget)

    const name = data.get("name").toString()
    const nftMint = new web3.PublicKey(data.get("mint").toString())

    const character = getCharacterAddress(publicKey, nftMint, PROGRAM_ID)

    const ix = createCharacter(
      {
        name,
      },
      {
        character,
        owner: publicKey,
        systemProgram,
        ownerTokenAccount: await associatedAddress({
          mint: nftMint,
          owner: publicKey,
        }),
        nftMint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenMetadata: getTokenMetadataAddress(nftMint),
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
    <form
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.6rem",
      }}
      onSubmit={publicKey ? onSubmit : null}
    >
      <Label
        sx={{
          flexDirection: "column",
          gap: ".8rem",
        }}
      >
        Choose a name:
        <Input name="name" required autoComplete="off" />
      </Label>
      <Label
        sx={{
          flexDirection: "column",
          gap: ".8rem",
        }}
      >
        Select an NFT of yours:
        <NFTSelectInput name="mint" NFTs={walletNFTs} />
      </Label>

      {!publicKey ? (
        <WalletConnectButton
          label={<Button type="button">Connect your wallet first</Button>}
        />
      ) : (
        <Button>Create</Button>
      )}
    </form>
  )
}
