import * as QuestError from "./QuestError"
import * as SpawnTypeError from "./SpawnTypeError"

export { BattleTurn } from "./BattleTurn"
export type { BattleTurnFields, BattleTurnJSON } from "./BattleTurn"
export { CharacterQuestState } from "./CharacterQuestState"
export type {
  CharacterQuestStateFields,
  CharacterQuestStateJSON,
} from "./CharacterQuestState"
export { Death } from "./Death"
export type { DeathFields, DeathJSON } from "./Death"
export { QuestError }

export type QuestErrorKind = QuestError.InvalidTimestamp
export type QuestErrorJSON = QuestError.InvalidTimestampJSON

export { SpawnTypeError }

export type SpawnTypeErrorKind = SpawnTypeError.InvalidTimestamp
export type SpawnTypeErrorJSON = SpawnTypeError.InvalidTimestampJSON
