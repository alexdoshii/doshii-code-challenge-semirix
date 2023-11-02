"use client"

import { store } from "@/store"
import Main from "@/components/Main"
import { Provider } from "react-redux"

const Page = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  )
}

export default Page
