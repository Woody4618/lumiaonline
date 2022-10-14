import { NextApiRequest, NextApiResponse } from "next"
import * as anchor from "@project-serum/anchor"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const endpoint =
      process.env.NEXT_PUBLIC_CONNECTION_NETWORK === "devnet"
        ? process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET
        : process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA

    if (!endpoint) throw new Error("No RPC endpoint configured.")

    const connection = new anchor.web3.Connection(endpoint, "confirmed")

    const parsedBody = JSON.parse(req.body)
    const serializedTx: {
      data: Buffer
    } = parsedBody.tx

    /** Basic security */
    /** End Basic security */

    const tx = anchor.web3.Transaction.from(serializedTx.data)

    // tx.partialSign(updateAuthority)

    const txid = await connection.sendRawTransaction(
      tx.serialize({
        requireAllSignatures: false,
      })
    )

    res.send({
      txid,
    })

    return true
  } catch (e) {
    console.log(e)

    res.send({
      txid: null,
      error: e + "",
    })
  }
}
