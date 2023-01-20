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
import { getRandomValues, webcrypto } from "crypto"
import { CharacterAccount, MonsterTypeAccount } from "./gen/accounts"
import { BN, web3 } from "@project-serum/anchor"
import { Connection } from "@solana/web3.js"

const getRandomBetween = (min: number, max: number) => {
  return (
    (min +
      ((max - min + 1) * webcrypto.getRandomValues(new Uint32Array(1))[0]) /
        2 ** 32) |
    0
  )
}

export const getBattleTurns = async (
  connection: Connection,
  character: web3.PublicKey,
  monster: web3.PublicKey
) => {
  const characterAccount = await CharacterAccount.fetch(connection, character)
  const monsterAccount = await MonsterTypeAccount.fetch(connection, monster)
  /**
   * Static level because there isn't any level attribute.
   * This is basically a base damage calculation.
   */
  const characterLvl = 10

  /** @TODO add skill attribute to the character account. */
  const characterSkill = characterAccount.meleeSkill + 20

  /** Damage formulas */
  const characterMinDamage = characterLvl / 5
  const characterMaxDamage = 0.085 * characterSkill + characterLvl / 5
  const monsterMinDamage = characterLvl / 5
  const monsterMaxDamage =
    0.085 * (monsterAccount.meleeSkill + 20) + characterLvl / 5

  let characterHitpoints = characterAccount.hitpoints
  let monsterHitpoints = monsterAccount.hitpoints

  const battleTurns: {
    characterDamage: BN
    monsterDamage: BN
    monsterHitpoints: BN
    characterHitpoints: BN
  }[] = []

  do {
    const characterDamage = new BN(
      getRandomBetween(characterMinDamage, characterMaxDamage)
    )

    const monsterDamage = new BN(
      getRandomBetween(monsterMinDamage, monsterMaxDamage)
    )

    characterHitpoints = characterHitpoints.sub(monsterDamage)
    monsterHitpoints = monsterHitpoints.sub(characterDamage)

    battleTurns.push({
      characterDamage,
      monsterDamage,
      characterHitpoints,
      monsterHitpoints,
    })
  } while (monsterHitpoints.gt(new BN(0)) && characterHitpoints.gt(new BN(0)))

  return battleTurns
}
