import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token"
import { expect } from "chai"
import { createCharacter } from "../app/lib/gen/instructions"
import { RpgProgram } from "../target/types/rpg_program"

const getCharacterAddress = (
  owner: anchor.web3.PublicKey,
  nftMint: anchor.web3.PublicKey,
  charactersProgram: anchor.web3.PublicKey
): anchor.web3.PublicKey => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("character"), owner.toBuffer(), nftMint.toBuffer()],
    charactersProgram
  )[0]
}

const getTokenMetadataAddress = (
  nftMint: anchor.web3.PublicKey
): anchor.web3.PublicKey => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0]
}

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
)

describe("rpg-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())
  const provider = anchor.AnchorProvider.env()

  const program = anchor.workspace.RpgProgram as Program<RpgProgram>

  const owner = program.provider.publicKey
  const systemProgram = anchor.web3.SystemProgram.programId

  it("Can create a character with a valid NFT", async () => {
    const mint = new anchor.web3.PublicKey(
      "Gg3VDgXUqRecKUhgDaMEhzhVX2ywtLmL8pU9oXZJiUZQ"
    )

    const character = getCharacterAddress(
      program.provider.publicKey,
      mint,
      program.programId
    )

    const ix = createCharacter(
      {
        name: "test",
      },
      {
        character,
        owner,
        systemProgram,
        ownerTokenAccount: await associatedAddress({ mint, owner }),
        nftMint: mint,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenMetadata: getTokenMetadataAddress(mint),
      }
    )

    const tx = new anchor.web3.Transaction().add(ix)
    await program.provider.sendAndConfirm(tx)

    const accountInfo = await program.account.characterAccount.fetch(character)
    console.log(accountInfo)

    expect(accountInfo.name).to.eq("test")
  })

  it("Won't allow creating a character with an invalid NFT", async () => {
    /** This is an invalid NFT. The "owner" wallet is not the actual owner. */
    const mint = new anchor.web3.PublicKey(
      "GmCovCq1gQKDXik8gWKDu1H1vnteLMca8YRMCt5URU8b"
    )

    const character = getCharacterAddress(
      program.provider.publicKey,
      mint,
      program.programId
    )

    /**
     * Try to create a character using an invalid NFT
     */
    try {
      await program.methods
        .createCharacter("test")
        .accounts({
          character,
          owner,
          systemProgram,
          ownerTokenAccount: await associatedAddress({ mint, owner }),
          nftMint: mint,
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
          tokenMetadata: getTokenMetadataAddress(mint),
        })
        .rpc()
      /** Throw an error if the RPC call passes */
      throw new Error("Could create a character with an invalid NFT")
    } catch (e) {}
  })
})
