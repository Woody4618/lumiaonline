import * as anchor from "@project-serum/anchor"
import { BN, Program } from "@project-serum/anchor"
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
import {
  BattleAccountJSON,
  CharacterAccount,
  CharacterAccountJSON,
  MonsterTypeAccount,
  CharacterAccountFields,
} from "../app/lib/gen/accounts"
import { getBattleTurns } from "../app/lib/battle"
import { BattleTurn } from "../app/lib/gen/types"
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js"
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccount,
  createMint,
  getAssociatedTokenAddress,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { getCharacterExperienceForLevel } from "../app/lib/character-utils"

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
            experience: new anchor.BN(monsterConfig.experience),
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
    it.skip("Can create a character with a valid NFT", async () => {
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

    it.skip("Won't allow creating a character with an invalid NFT", async () => {
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

    it.skip("Can battle a monster spawn, obtain experience, and advance their level", async () => {
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

      let characterAccBeforeBattle: CharacterAccountFields
      let characterAccAfterBattle: CharacterAccountFields

      /** Battle monsters til the character advance in level */
      do {
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

        characterAccBeforeBattle = await program.account.characterAccount.fetch(
          character
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

        const lastTurn = battleAcc.battleTurns[battleAcc.battleTurns.length - 1]
        characterAccAfterBattle = await program.account.characterAccount.fetch(
          character
        )

        if (lastTurn.characterHitpoints.toNumber() <= 0) {
          /** Expect to die if no hitpoints */
          expect(characterAccAfterBattle.deaths).to.be.greaterThan(
            characterAccBeforeBattle.deaths
          )
        } else {
          expect(characterAccAfterBattle.deaths).to.be.eq(
            characterAccBeforeBattle.deaths
          )

          const monsterTypeAcc = await MonsterTypeAccount.fetch(
            program.provider.connection,
            monsterType
          )

          // expect character to have gained experience
          const expToExpect = characterAccBeforeBattle.experience.add(
            monsterTypeAcc.experience
          )

          expect(characterAccAfterBattle.experience.eq(expToExpect)).to.be.true

          /** Expect character to have advanced in level if the experience is enough */
          const expForNextLevel = getCharacterExperienceForLevel(
            characterAccBeforeBattle.level.toNumber() + 1
          )
          if (
            characterAccAfterBattle.experience.gte(
              new anchor.BN(expForNextLevel)
            )
          ) {
            // Expect level upgrade
            expect(
              characterAccAfterBattle.level.cmp(
                characterAccBeforeBattle.level.add(new anchor.BN(1))
              )
            ).to.be.eq(0)

            // Expect HP upgrade
            expect(
              characterAccAfterBattle.hitpoints.gt(
                characterAccBeforeBattle.hitpoints
              )
            )
          }
        }
        /** Do everything til the level upgrades */
      } while (characterAccAfterBattle.level <= characterAccBeforeBattle.level)
      /** Try to kill the same spawn again */
      // @TODO add test to validate spawntimes
      // try {
      //   await program.provider.sendAndConfirm(tx)

      //   throw new Error("Could terminate a spawn instance before the spawntime")
      // } catch (e) {}
    })
  })

  describe("validate quests", () => {
    it.skip("Can join a quest", async () => {
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

    it.skip("Can claim a quest", async () => {
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
      expect(characterAcc.experience.cmp(questAcc.rewardExp)).to.eq(1)
      expect(characterAcc.questState).to.be.null
    })

    it.skip("Cannot claim a quest before the duration", async () => {
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

  describe("vault", () => {
    const findVaultAddress = (
      owner: PublicKey,
      authority: PublicKey,
      programId: PublicKey
    ): PublicKey =>
      PublicKey.findProgramAddressSync(
        [Buffer.from("vault"), owner.toBuffer(), authority.toBuffer()],
        programId
      )[0]
    const connection = program.provider.connection
    const authority = Keypair.generate()
    const user = Keypair.generate()
    const mockSplToken = Keypair.generate()
    const vault = findVaultAddress(
      user.publicKey,
      authority.publicKey,
      program.programId
    )

    before(async () => {
      const tx = await connection.requestAirdrop(
        user.publicKey,
        LAMPORTS_PER_SOL
      )
      await connection.confirmTransaction(tx)
    })

    it.skip("SOL - Deposit", async () => {
      const initializeVault = await program.methods
        .initializeVault()
        .accounts({
          vault,
          owner: user.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user, authority])
        .instruction()

      await program.methods
        .solDeposit(new BN(100000))
        .accounts({
          vault,
          from: user.publicKey,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user, authority])
        .preInstructions([initializeVault])
        .rpc()
    })

    it.skip("SOL - Withdraw", async () => {
      await program.methods
        .solWithdraw(new BN(1000))
        .accounts({
          vault,
          owner: user.publicKey,
          authority: authority.publicKey,
        })
        .signers([authority])
        .rpc()
    })

    it.skip("SPL - Deposit", async () => {
      const mint = await createMint(
        connection,
        user,
        user.publicKey,
        user.publicKey,
        0,
        mockSplToken
      )
      await createAssociatedTokenAccount(connection, user, mint, user.publicKey)
      const userAta = await getAssociatedTokenAddress(mint, user.publicKey)
      await mintTo(connection, user, mint, userAta, user, 100000)

      const vaultAta = await getAssociatedTokenAddress(mint, vault, true)
      await program.methods
        .splDeposit(new BN(1000))
        .accounts({
          vault,
          vaultAta,

          mint,

          owner: user.publicKey,
          ownerAta: userAta,

          authority: authority.publicKey,

          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([user, authority])
        .rpc()
    })

    it.skip("SPL - Withdraw", async () => {
      const vaultAta = await getAssociatedTokenAddress(
        mockSplToken.publicKey,
        vault,
        true
      )
      const userAta = await getAssociatedTokenAddress(
        mockSplToken.publicKey,
        user.publicKey
      )

      await program.methods
        .splWithdraw(new BN(1000))
        .accounts({
          vault,
          vaultAta,

          mint: mockSplToken.publicKey,

          owner: user.publicKey,
          ownerAta: userAta,

          authority: authority.publicKey,

          rent: SYSVAR_RENT_PUBKEY,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([authority])
        .rpc()
    })
  })
})
