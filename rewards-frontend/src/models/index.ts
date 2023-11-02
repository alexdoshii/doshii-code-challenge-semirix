import { Models } from "@rematch/core"
import { users } from "./users"
import { rewards } from "./rewards"

export interface RootModel extends Models<RootModel> {
  users: typeof users
  rewards: typeof rewards
}
export const models: RootModel = { users, rewards }
