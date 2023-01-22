import * as anchor from "@project-serum/anchor"
import { Program, BN } from "@project-serum/anchor"
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js"
import {
  createMint,
  mintTo,
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token"
import { Vault } from "../target/types/vault"

const findVaultAddress = (
  owner: PublicKey,
  authority: PublicKey,
  programId: PublicKey
): PublicKey =>
  PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), owner.toBuffer(), authority.toBuffer()],
    programId
  )[0]

describe("vault", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env())

  const program = anchor.workspace.Vault as Program<Vault>

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
    const tx = await connection.requestAirdrop(user.publicKey, LAMPORTS_PER_SOL)
    await connection.confirmTransaction(tx)
  })

  it("SOL - Deposit", async () => {
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
        owner: user.publicKey,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, authority])
      .preInstructions([initializeVault])
      .rpc()
  })

  it("SOL - Withdraw", async () => {
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

  it("SPL - Deposit", async () => {
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

  it("SPL - Withdraw", async () => {
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
