import { init, RematchDispatch, RematchRootState } from "@rematch/core"
import { models, RootModel } from "@/models"
import immerPlugin from "@rematch/immer"
import selectPlugin from "@rematch/select"

export const store = init({
  models,
  plugins: [immerPlugin() as any, selectPlugin() as any],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
