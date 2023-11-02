import RewardsDashboard from "@/components/RewardsDashboard"
import UsersDashboard from "@/components/UsersDashboard"
import { Dispatch } from "@/store"
import { Disclosure } from "@headlessui/react"
import { X, List, Trophy } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import UserDashboard from "../UserDashboard"
import { Toaster } from "react-hot-toast"
import RewardDashboard from "../RewardDashboard"
import { endpoint } from "@/utils"

export interface PageRoute {
  page: string
  parameter?: any
}

export interface PageProps {
  route: PageRoute
  setRoute: (route: PageRoute) => void
}

const pages: {
  [key: string]: {
    name: string
    menu: boolean
    content: (props: PageProps) => JSX.Element
  }
} = {
  users: {
    name: "Users",
    menu: true,
    content: UsersDashboard,
  },
  user: {
    name: "User",
    menu: false,
    content: UserDashboard,
  },
  rewards: {
    name: "Rewards",
    menu: true,
    content: RewardsDashboard,
  },
  reward: {
    name: "Reward",
    menu: false,
    content: RewardDashboard,
  },
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const Main = () => {
  const [route, setRoute] = useState<PageRoute>({ page: "users" })
  const dispatch = useDispatch<Dispatch>()
  const Page = pages[route.page].content

  fetch(endpoint("users", "get-by-email", "johndoe@example.com"), {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: ["id", "email"],
    }),
  })

  useEffect(() => {
    dispatch.users.fetchAll()
    dispatch.rewards.fetchAll()
  }, [route])

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <Toaster position="top-right" reverseOrder={false} />
      <div className="min-h-full">
        <div className="bg-gray-800 pb-32">
          <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
              <>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                  <div className="border-b border-gray-700">
                    <div className="flex h-16 items-center justify-between px-4 sm:px-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 text-blue-500">
                          <Trophy size={32} weight="duotone" />
                        </div>
                        <div className="hidden md:block">
                          <div className="ml-10 flex items-baseline space-x-4">
                            {Object.keys(pages).map((page) =>
                              pages[page].menu ? (
                                <button
                                  key={page}
                                  className={classNames(
                                    page === route.page
                                      ? "bg-gray-900 text-white"
                                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                    "rounded-md px-3 py-2 text-sm font-medium transition-colors"
                                  )}
                                  onClick={() => setRoute({ page })}
                                  aria-current={
                                    page === route.page ? "page" : undefined
                                  }
                                >
                                  {pages[page].name}
                                </button>
                              ) : null
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="-mr-2 flex md:hidden">
                        {/* Mobile menu button */}
                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="absolute -inset-0.5" />
                          <span className="sr-only">Open main menu</span>
                          {open ? (
                            <X className="block h-6 w-6" aria-hidden="true" />
                          ) : (
                            <List
                              className="block h-6 w-6"
                              aria-hidden="true"
                            />
                          )}
                        </Disclosure.Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Disclosure.Panel className="border-b border-gray-700 md:hidden">
                  <div className="space-y-1 px-2 py-3 sm:px-3">
                    {Object.keys(pages).map((page) =>
                      pages[page].menu ? (
                        <Disclosure.Button
                          key={page}
                          as="button"
                          className={classNames(
                            route.page === page
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "block rounded-md px-3 py-2 text-base font-medium"
                          )}
                          onClick={() => setRoute({ page })}
                          aria-current={
                            route.page === page ? "page" : undefined
                          }
                        >
                          {pages[page].name}
                        </Disclosure.Button>
                      ) : null
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <header className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {pages[route.page].name}
              </h1>
            </div>
          </header>
        </div>

        <main className="-mt-32">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white px-5 py-6 shadow sm:px-6">
              <Page route={route} setRoute={setRoute} />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Main
