import { getRandomValues } from "crypto"
import { CharacterAccount, MonsterTypeAccount } from "./gen/accounts"
import { BN, web3 } from "@project-serum/anchor"
import { Connection } from "@solana/web3.js"

const getRandomBetween = (min: number, max: number) => {
  return (
    (min +
      ((max - min + 1) * getRandomValues(new Uint32Array(1))[0]) / 2 ** 32) |
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
    0.085 * (monsterAccount.config.meleeSkill + 20) + characterLvl / 5

  let characterHitpoints = characterAccount.hitpoints
  let monsterHitpoints = monsterAccount.config.hitpoints

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
