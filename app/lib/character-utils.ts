/** Returns the minimum experience the character should have at a certain level */
export function getCharacterExperienceForLevel(characterLevel) {
  const experience =
    (50 / 3) *
    (Math.pow(characterLevel, 3) -
      6 * Math.pow(characterLevel, 2) +
      17 * characterLevel -
      12)

  return experience
}

export function getCharacterGainedExperience(characterLevel) {
  const experienceFrom = getCharacterExperienceForLevel(characterLevel)
  const experienceTo = getCharacterExperienceForLevel(characterLevel + 1)

  return experienceTo - experienceFrom
}
