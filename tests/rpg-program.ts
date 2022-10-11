import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { expect } from "chai"
import { RpgProgram } from "../target/types/rpg_program"

const getCharacterAddress = (
  owner: anchor.web3.PublicKey,
  charactersProgram: anchor.web3.PublicKey
): anchor.web3.PublicKey => {
  return anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("character"), owner.toBuffer()],
    charactersProgram
  )[0]
}

describe("rpg-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.RpgProgram as Program<RpgProgram>

  it("Can create a character", async () => {
    const character = getCharacterAddress(
      program.provider.publicKey,
      program.programId
    )
    const owner = program.provider.publicKey
    const systemProgram = anchor.web3.SystemProgram.programId

    const tx = await program.methods
      .createCharacter("test")
      .accounts({
        character,
        owner,
        systemProgram,
      })
      .rpc()

    const accountInfo = await program.account.characterAccount.fetch(character)
    console.log(accountInfo)

    expect(accountInfo.name).to.eq("test")

    console.log("Your transaction signature", tx)
  })
})
