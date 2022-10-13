import * as QuestError from "./QuestError"

export { MonsterConfig } from "./MonsterConfig"
export type { MonsterConfigFields, MonsterConfigJSON } from "./MonsterConfig"
export { QuestState } from "./QuestState"
export type { QuestStateFields, QuestStateJSON } from "./QuestState"
export { QuestConfig } from "./QuestConfig"
export type { QuestConfigFields, QuestConfigJSON } from "./QuestConfig"
export { Death } from "./Death"
export type { DeathFields, DeathJSON } from "./Death"
export { QuestError }

export type QuestErrorKind = QuestError.InvalidTimestamp
export type QuestErrorJSON = QuestError.InvalidTimestampJSON
