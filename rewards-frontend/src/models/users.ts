import { createModel } from "@rematch/core"
import type { RootModel } from "."
import { endpoint } from "@/utils"

export interface UserModel {
  id: string
  email: string
  name: string
  dob: number
  rewards: string // JSON string
}

export interface UserRewards {
  [id: string]: boolean
}

interface UsersModel {
  list: UserModel[]
}

export const users = createModel<RootModel>()({
  name: "users",
  state: { list: [] } as UsersModel,
  reducers: {
    set(state, payload: UserModel[]) {
      state.list = payload
    },
  },
  effects: (dispatch) => ({
    async fetchAll() {
      const result = await fetch(endpoint("users", "all"))
      const users = await result.json()

      dispatch.users.set(users.data as UserModel[])
    },
  }),
})
