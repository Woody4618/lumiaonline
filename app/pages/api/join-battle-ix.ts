import { web3 } from "@project-serum/anchor"
import { getBattleTurns } from "lib/battle"
import { joinBattle } from "lib/gen/instructions"
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

    const battleTurns = await getBattleTurns(
      connection,
      characterAddress,
      monsterAddress
    )

    const battle = web3.Keypair.generate()
    const ix = joinBattle(
      { battleTurns },
      {
        monster: monsterAddress,
        character: characterAddress,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
        battle: battle.publicKey,
        owner: ownerAddress,
        systemProgram: web3.SystemProgram.programId,
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
