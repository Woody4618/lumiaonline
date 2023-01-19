import * as anchor from "@project-serum/anchor"
import { Program, BN } from "@project-serum/anchor"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
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
  const authority = anchor.web3.Keypair.generate()
  const user = anchor.web3.Keypair.generate()
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
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user, authority])
      .instruction()

    await program.methods
      .solDeposit(new BN(100000))
      .accounts({
        vault,
        owner: user.publicKey,
        authority: authority.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
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
})
