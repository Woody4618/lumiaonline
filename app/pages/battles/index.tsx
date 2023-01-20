/**
  Lumia Online (https://github.com/lumiaonline)
  Copyright (C) 2023 Lumia Online

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
/** @jsxImportSource theme-ui */
import { Heading, Text, Label, Input, Button, Flex } from "@theme-ui/components"

import Header from "@/components/Header/Header"
import { useEffect, useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { web3 } from "@project-serum/anchor"
import { getBattles, getCharacters } from "lib/program-utils"
import {
  BattleAccount,
  CharacterAccount,
  MonsterTypeAccount,
} from "lib/gen/accounts"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import { Metaplex } from "@metaplex-foundation/js"
import { Layout } from "@/components/Layout/Layout"

type BattleWithParticipants = {
  account: BattleAccount & {
    participants: {
      character: CharacterAccount
      monster: MonsterTypeAccount
    }
  }
  pubkey: web3.PublicKey
}

export default function Battles() {
  const { connection } = useConnection()
  const [battles, setBattles] = useState<BattleWithParticipants[]>(null)

  useEffect(() => {
    ;(async () => {
      if (connection) {
        const battles = await getBattles(connection)

        const withParticipants = await Promise.all(
          battles.map(async (battle) => {
            const character = await CharacterAccount.fetch(
              connection,
              battle.account.participants[0]
            )

            const monster = await MonsterTypeAccount.fetch(
              connection,
              battle.account.participants[1]
            )

            const newBattleAccount = Object.assign(battle.account, {
              participants: { character, monster },
            })

            return {
              ...battle,
              account: newBattleAccount,
            }
          })
        )

        setBattles(withParticipants)
      }
    })()
  }, [connection])

  return (
    <Layout>
      <Heading mb=".8rem" variant="heading1">
        Battles
      </Heading>
      <Text mb="3.2rem">List of past battles</Text>

      <Flex
        sx={{
          flexDirection: "column",
          gap: "1.6rem",
        }}
      >
        {battles ? (
          battles.map((battle) => {
            const { character, monster } = battle.account.participants
            const lastTurn =
              battle.account.battleTurns[battle.account.battleTurns.length - 1]

            let characterDied = false
            if (lastTurn.characterHitpoints.toNumber() <= 0) {
              characterDied = true
            }

            return (
              <Flex
                sx={{
                  alignItems: "center",
                  gap: ".8rem",
                }}
                key={battle.pubkey.toString()}
              >
                {characterDied
                  ? `${character.name} died by a ${monster.name}`
                  : `${character.name} killed a ${monster.name}`}
              </Flex>
            )
          })
        ) : (
          <LoadingIcon />
        )}
      </Flex>
    </Layout>
  )
}
