import { createModel } from "@rematch/core"
import type { RootModel } from "."
import { endpoint } from "@/utils"

export interface RewardModel {
  id: string
  name: string
  description: string
  expires: number
}

interface RewardsModel {
  list: RewardModel[]
}

export const rewards = createModel<RootModel>()({
  name: "rewards",
  state: { list: [] } as RewardsModel,
  reducers: {
    set(state, payload: RewardModel[]) {
      state.list = payload
    },
  },
  effects: (dispatch) => ({
    async fetchAll() {
      const result = await fetch(endpoint("rewards", "all"))
      const rewards = await result.json()

      dispatch.rewards.set(rewards.data as RewardModel[])
    },
  }),
})
