import * as anchor from "@project-serum/anchor"
import { Program } from "@project-serum/anchor"
import { associatedAddress } from "@project-serum/anchor/dist/cjs/utils/token"
import { expect } from "chai"
import {
  createCharacter,
  createMonsterType,
  createMonsterSpawn,
  joinBattle,
} from "../app/lib/gen/instructions"
import { createQuest } from "../app/lib/gen/instructions/createQuest"
import { joinQuest } from "../app/lib/gen/instructions/joinQuest"
import { PROGRAM_ID } from "../app/lib/gen/programId"
import {
  getCharacterAddress,
  getTokenMetadataAddress,
  TOKEN_METADATA_PROGRAM_ID,
} from "../app/lib/program-utils"
import { Chainquest } from "../target/types/chainquest"
import { quests } from "../app/data/quests"
import { monsters } from "../app/data/monsters"
import { spawns } from "../app/data/spawns"
import { claimQuest } from "../app/lib/gen/instructions/claimQuest"
import { BattleAccountJSON } from "../app/lib/gen/accounts"
import { getBattleTurns } from "../app/lib/battle"
import { BattleTurn } from "../app/lib/gen/types"

describe("chainquest", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.Chainquest as Program<Chainquest>

  const owner = program.provider.publicKey
  const systemProgram = anchor.web3.SystemProgram.programId

  describe("initialize", () => {
    it("Can create quests", async () => {
      const ixs = quests.map((questConfig) => {
        const id = questConfig.id
        const quest = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("quest"), Buffer.from(id)],
          PROGRAM_ID
        )[0]

        const ix = createQuest(
          {
            duration: new anchor.BN(questConfig.duration),
            rewardExp: new anchor.BN(questConfig.reward),
            id,
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
        [Buffer.from("quest"), Buffer.from(questToValidate.id)],
        PROGRAM_ID
      )[0]

      const questAcc = await program.account.questAccount.fetch(questAddress)

      expect(questAcc.duration.toNumber()).to.eq(questToValidate.duration)
    })

    it("Can create monsters", async () => {
      const ixs = monsters.map((monsterConfig, index) => {
        const { name } = monsterConfig

        const monsterType = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("monster_type"), Buffer.from(name)],
          PROGRAM_ID
        )[0]

        const ix = createMonsterType(
          {
            name,
            hitpoints: new anchor.BN(monsterConfig.hitpoints),
            meleeSkill: monsterConfig.meleeSkill,
          },
          {
            monsterType,
            signer: program.provider.publicKey,
            systemProgram,
          }
        )
        return ix
      })

      const tx = new anchor.web3.Transaction().add(...ixs)
      await program.provider.sendAndConfirm(tx)

      /** Validate if the account has been created */
      const monsterToValidate = monsters[0]
      const monsterAddress = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("monster_type"), Buffer.from(monsterToValidate.name)],
        PROGRAM_ID
      )[0]

      const monsterAcc = await program.account.monsterTypeAccount.fetch(
        monsterAddress
      )

      expect(monsterAcc.hitpoints.toNumber()).to.eq(monsterToValidate.hitpoints)
    })

    it("Can create a monster spawn", async () => {
      const ixs = spawns.map((spawnConfig, index) => {
        const { monsterName, spawntime, town } = spawnConfig

        const monsterType = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("monster_type"), Buffer.from(monsterName)],
          PROGRAM_ID
        )[0]

        const monsterSpawn = anchor.web3.PublicKey.findProgramAddressSync(
          [Buffer.from("monster_spawn"), Buffer.from(monsterName)],
          PROGRAM_ID
        )[0]

        const ix = createMonsterSpawn(
          {
            spawntime: new anchor.BN(spawntime),
          },
          {
            monsterSpawn,
            monsterType,
            signer: program.provider.publicKey,
            systemProgram,
            clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          }
        )
        return ix
      })

      const tx = new anchor.web3.Transaction().add(...ixs)
      await program.provider.sendAndConfirm(tx)

      /** Validate if the account has been created */
      const spawnToValidate = spawns[0]
      const spawnAddress = anchor.web3.PublicKey.findProgramAddressSync(
        [
          Buffer.from("monster_spawn"),
          Buffer.from(spawnToValidate.monsterName),
        ],
        PROGRAM_ID
      )[0]

      const spawnAcc = await program.account.monsterSpawnAccount.fetch(
        spawnAddress
      )

      expect(spawnAcc.spawntime.toNumber()).to.eq(spawnToValidate.spawntime)
    })
  })

  describe("validate characters", () => {
    it("Can create a character with a valid NFT", async () => {
      const mint = new anchor.web3.PublicKey(
        "6YHvHusPz8LoydSTB77WhehRfs12DgAJ5jR9fXhCagnL"
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

  describe("validate quests", () => {
    it("Can join a quest", async () => {
      const id = quests[0].id

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(id)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "6YHvHusPz8LoydSTB77WhehRfs12DgAJ5jR9fXhCagnL"
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

      expect(characterAcc.questState.questId).to.eq(questAcc.id)
    })

    it("Can claim a quest", async () => {
      const id = quests[0].id

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(id)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "6YHvHusPz8LoydSTB77WhehRfs12DgAJ5jR9fXhCagnL"
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
      expect(characterAcc.experience.cmp(questAcc.rewardExp)).to.eq(0)
      expect(characterAcc.questState).to.be.null
    })

    it("Cannot claim a quest before the duration", async () => {
      const id = quests[1].id

      const quest = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("quest"), Buffer.from(id)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "6YHvHusPz8LoydSTB77WhehRfs12DgAJ5jR9fXhCagnL"
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

  describe("validate spawns", () => {
    it("Can battle a monster spawn til death", async () => {
      const { monsterName, spawntime, town } = spawns[0]

      const monsterType = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("monster_type"), Buffer.from(monsterName)],
        PROGRAM_ID
      )[0]

      const monsterSpawn = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("monster_spawn"), Buffer.from(monsterName)],
        PROGRAM_ID
      )[0]

      const mint = new anchor.web3.PublicKey(
        "6YHvHusPz8LoydSTB77WhehRfs12DgAJ5jR9fXhCagnL"
      )

      const character = getCharacterAddress(
        program.provider.publicKey,
        mint,
        program.programId
      )

      const battleTurns = await getBattleTurns(
        program.provider.connection,
        character,
        monsterType
      )

      const battle = anchor.web3.Keypair.generate()

      const ix = joinBattle(
        {
          battleTurns,
        },
        {
          battle: battle.publicKey,
          character: character,
          monsterSpawn,
          monsterType,
          owner: program.provider.publicKey,
          systemProgram,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        }
      )

      const tx = new anchor.web3.Transaction().add(ix)
      await program.provider.sendAndConfirm(tx, [battle])

      const spawnAcc = await program.account.monsterSpawnAccount.fetch(
        monsterSpawn
      )

      expect(spawnAcc.lastKilled).to.not.be.null

      // @ts-ignore
      const battleAcc: BattleAccountJSON & {
        battleTurns: BattleTurn[]
      } = await program.account.battleAccount.fetch(battle.publicKey)

      /** Expect character to die or win  */
      const lastTurn = battleAcc.battleTurns[battleAcc.battleTurns.length - 1]
      const characterAcc = await program.account.characterAccount.fetch(
        character
      )

      if (lastTurn.characterHitpoints.toNumber() <= 0) {
        expect(characterAcc.deaths).to.be.eq(1)
      } else {
        expect(characterAcc.deaths).to.be.eq(0)
      }

      /** Try to kill the same spawn again */
      try {
        await program.provider.sendAndConfirm(tx)

        throw new Error("Could terminate a spawn instance before the spawntime")
      } catch (e) {}
    })
  })
})
