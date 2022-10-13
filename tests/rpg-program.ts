import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token"
import { expect } from "chai"
import { createCharacter } from "../app/lib/gen/instructions"
import { createQuest } from "../app/lib/gen/instructions/createQuest"
import { joinQuest } from "../app/lib/gen/instructions/joinQuest"
import { PROGRAM_ID } from "../app/lib/gen/programId"
import {
  getCharacterAddress,
  getTokenMetadataAddress,
  TOKEN_METADATA_PROGRAM_ID,
} from "../app/lib/utils"
import { RpgProgram } from "../target/types/rpg_program"
import quests from "../app/lib/quests.json"
import { claimQuest } from "../app/lib/gen/instructions/claimQuest"

describe("rpg-program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.RpgProgram as Program<RpgProgram>

  const owner = program.provider.publicKey
  const systemProgram = anchor.web3.SystemProgram.programId
  describe("characters", () => {
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

      const accountInfo = await program.account.characterAccount.fetch(
        character
      )

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
        /** Throw an error if the RPC call passes */
        throw new Error("Could create a character with an invalid NFT")
      } catch (e) {}
    })
  })

  describe("quests", () => {
    it("Can create a quest", async () => {
      const ixs = quests.map((questConfig) => {
        const uuid = questConfig.uuid
        const quest = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("quest"), Buffer.from(uuid)],
          PROGRAM_ID
        )[0]

        const ix = createQuest(
          {
            config: {
              duration: new anchor.BN(questConfig.duration),
              rewardExp: new anchor.BN(questConfig.reward),
              uuid,
            },
          },
          {
            quest,
            signer: program.provider.publicKey,
            systemProgram,
          }
        )
        return ix
      })

      const tx = new anchor.web3.Transaction().add(...ixs)
      await program.provider.sendAndConfirm(tx)

      /** Validate if the account has been created */
      const questToValidate = quests[0]
      const questAddress = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(questToValidate.uuid)],
        PROGRAM_ID
      )[0]

      const questAcc = await program.account.questAccount.fetch(questAddress)

      expect(questAcc.config.duration.toNumber()).to.eq(
        questToValidate.duration
      )
    })

    it("Can join a quest", async () => {
      const uuid = quests[0].uuid

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(uuid)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "Gg3VDgXUqRecKUhgDaMEhzhVX2ywtLmL8pU9oXZJiUZQ"
      )

      const character = getCharacterAddress(
        program.provider.publicKey,
        mint,
        program.programId
      )

      const ix = joinQuest({
        quest,
        character,
        nftMint: mint,
        owner: program.provider.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })

      const tx = new anchor.web3.Transaction().add(ix)
      await program.provider.sendAndConfirm(tx)

      /** Expect character experience to be increased  */
      const questAcc = await program.account.questAccount.fetch(quest)
      const characterAcc = await program.account.characterAccount.fetch(
        character
      )

      expect(characterAcc.questState.questUuid).to.eq(questAcc.config.uuid)
    })

    it("Can claim a quest", async () => {
      const uuid = quests[0].uuid

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(uuid)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "Gg3VDgXUqRecKUhgDaMEhzhVX2ywtLmL8pU9oXZJiUZQ"
      )

      const character = getCharacterAddress(
        program.provider.publicKey,
        mint,
        program.programId
      )

      const ix = claimQuest({
        quest,
        character,
        nftMint: mint,
        owner: program.provider.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })

      const tx = new anchor.web3.Transaction().add(ix)
      await program.provider.sendAndConfirm(tx)

      /** Expect character experience to be increased  */
      const questAcc = await program.account.questAccount.fetch(quest)
      const characterAcc = await program.account.characterAccount.fetch(
        character
      )
      expect(characterAcc.experience.cmp(questAcc.config.rewardExp)).to.eq(0)
      expect(characterAcc.questState).to.be.null
    })

    it("Cannot claim a quest before the duration", async () => {
      const uuid = quests[1].uuid

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(uuid)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "Gg3VDgXUqRecKUhgDaMEhzhVX2ywtLmL8pU9oXZJiUZQ"
      )

      const character = getCharacterAddress(
        program.provider.publicKey,
        mint,
        program.programId
      )

      /** Join quest 1 */
      const ix1 = joinQuest({
        quest,
        character,
        nftMint: mint,
        owner: program.provider.publicKey,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
      })

      const tx1 = new anchor.web3.Transaction().add(ix1)
      await program.provider.sendAndConfirm(tx1)

      try {
        /** Try to claim quest 1 */
        const ix2 = claimQuest({
          quest,
          character,
          nftMint: mint,
          owner: program.provider.publicKey,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        })

        const tx = new anchor.web3.Transaction().add(ix2)
        await program.provider.sendAndConfirm(tx)
        throw new Error("Could claim a quest before the duration")
      } catch (e) {}
    })
  })
})
