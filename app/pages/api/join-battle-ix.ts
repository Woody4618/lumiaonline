/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 lumiaonline

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
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

    const { characterAddress, monsterAddress, owner } = req.query

    const characterPubKey = new web3.PublicKey(characterAddress)
    const monsterPubKey = new web3.PublicKey(monsterAddress)
    const ownerAddress = new web3.PublicKey(owner)

    const monsterTypeAccount = await MonsterTypeAccount.fetch(
      connection,
      monsterPubKey
    )

    const monsterSpawn = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("monster_spawn"), Buffer.from(monsterTypeAccount.name)],
      PROGRAM_ID
    )[0]

    const battleTurns = await getBattleTurns(
      connection,
      characterPubKey,
      monsterPubKey
    )

    const battle = web3.Keypair.generate()

    const ix = joinBattle(
      {
        battleTurns,
      },
      {
        battle: battle.publicKey,
        character: characterPubKey,
        monsterSpawn,
        monsterType: monsterPubKey,
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
