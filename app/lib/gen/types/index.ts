import * as QuestError from "./QuestError"
import * as SpawnTypeError from "./SpawnTypeError"

export { BattleTurn } from "./BattleTurn"
export type { BattleTurnFields, BattleTurnJSON } from "./BattleTurn"
export { MonsterConfig } from "./MonsterConfig"
export type { MonsterConfigFields, MonsterConfigJSON } from "./MonsterConfig"
export { CharacterQuestState } from "./CharacterQuestState"
export type {
  CharacterQuestStateFields,
  CharacterQuestStateJSON,
} from "./CharacterQuestState"
export { QuestConfig } from "./QuestConfig"
export type { QuestConfigFields, QuestConfigJSON } from "./QuestConfig"
export { Death } from "./Death"
export type { DeathFields, DeathJSON } from "./Death"
export { QuestError }

export type QuestErrorKind = QuestError.InvalidTimestamp
export type QuestErrorJSON = QuestError.InvalidTimestampJSON

export { SpawnTypeError }

export type SpawnTypeErrorKind = SpawnTypeError.InvalidTimestamp
export type SpawnTypeErrorJSON = SpawnTypeError.InvalidTimestampJSON
