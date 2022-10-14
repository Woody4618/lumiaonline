import { getRandomValues } from "crypto"
import { CharacterAccount, MonsterAccount } from "./gen/accounts"
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
  const monsterAccount = await MonsterAccount.fetch(connection, monster)
  /**
   * Static level because there isn't any level attribute.
   * This is basically a base damage calculation.
   */
  const characterLvl = 10

  /** @TODO add skill attribute to the character account. */
  const characterSkill = characterAccount.meleeSkill

  /** Damage formulas */
  const characterMinDamage = characterLvl / 5
  const characterMaxDamage = 0.085 * characterSkill + characterLvl / 5
  const monsterMinDamage = characterLvl / 5
  const monsterMaxDamage =
    0.085 * monsterAccount.config.meleeSkill + characterLvl / 5

  let characterHitpoints = characterAccount.hitpoints.toNumber()
  let monsterHitpoints = monsterAccount.config.hitpoints.toNumber()

  const battleTurns: {
    characterDamage: BN
    monsterDamage: BN
  }[] = []

  do {
    const characterDamage = getRandomBetween(
      characterMinDamage,
      characterMaxDamage
    )

    const monsterDamage = getRandomBetween(monsterMinDamage, monsterMaxDamage)

    characterHitpoints -= monsterDamage
    monsterHitpoints -= characterDamage

    battleTurns.push({
      characterDamage: new BN(characterDamage),
      monsterDamage: new BN(monsterDamage),
    })
  } while (monsterHitpoints > 0 && characterHitpoints > 0)

  return battleTurns
}
