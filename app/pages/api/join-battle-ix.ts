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

    const { character, monster } = req.query

    const characterAddress = new web3.PublicKey(character)
    const monsterAddress = new web3.PublicKey(monster)

    const battleTurns = await getBattleTurns(
      connection,
      characterAddress,
      monsterAddress
    )

    const ix = joinBattle(
      { battleTurns },
      {
        monster: monsterAddress,
        character: characterAddress,
        clock: web3.SYSVAR_CLOCK_PUBKEY,
      }
    )

    res.send(ix)

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
