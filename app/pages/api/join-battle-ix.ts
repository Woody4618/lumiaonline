import { web3 } from "@project-serum/anchor"
import { getBattleTurns } from "lib/battle"
import { MonsterTypeAccount } from "lib/gen/accounts"
import { joinBattle } from "lib/gen/instructions"
import { PROGRAM_ID } from "lib/gen/programId"
import { NextApiRequest, NextApiResponse } from "next"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const endpoint =
      process.env.NEXT_PUBLIC_CONNECTION_NETWORK === "devnet"
        ? process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET
        : process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA

    if (!endpoint) throw new Error("No RPC endpoint configured.")

    const connection = new web3.Connection(endpoint, "confirmed")

    const { character, monster, owner } = req.query

    const characterAddress = new web3.PublicKey(character)
    const monsterAddress = new web3.PublicKey(monster)
    const ownerAddress = new web3.PublicKey(owner)

    const monsterAccount = await MonsterTypeAccount.fetch(
      connection,
      monsterAddress
    )

    const monsterType = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("monster_type"), Buffer.from(monsterAccount.name)],
      PROGRAM_ID
    )[0]

    const monsterSpawn = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("monster_spawn"), Buffer.from(monsterAccount.name)],
      PROGRAM_ID
    )[0]

    const battleTurns = await getBattleTurns(
      connection,
      characterAddress,
      monsterAddress
    )

    const battle = web3.Keypair.generate()

    const ix = joinBattle(
      {
        battleTurns,
      },
      {
        battle: battle.publicKey,
        character: characterAddress,
        monsterSpawn,
        monsterType,
        owner: ownerAddress,
        systemProgram: web3.SystemProgram.programId,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      }
    )

    const tx = new web3.Transaction().add(ix)

    const latest = await connection.getLatestBlockhash("confirmed")
    tx.feePayer = ownerAddress

    tx.recentBlockhash = latest.blockhash
    tx.partialSign(battle)

    res.send(
      JSON.stringify(
        tx.serialize({
          verifySignatures: false,
        })
      )
    )

    return true
  } catch (e) {
    console.log(e)

    res.send({
      txid: null,
      error: e + "",
    })

    return true
  }
}
