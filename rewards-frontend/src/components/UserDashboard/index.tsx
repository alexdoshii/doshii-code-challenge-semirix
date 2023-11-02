import { useEffect, useState } from "react"
import { PageProps } from "../Main"
import { UserModel, UserRewards } from "@/models/users"
import { endpoint } from "@/utils"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import toast from "react-hot-toast"

interface UserDashboardProps extends PageProps {}

const UserDashboard = ({ route }: UserDashboardProps) => {
  const rewards = useSelector((state: RootState) => state.rewards.list)
  const [user, setUser] = useState<UserModel | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userRewards, setUserRewards] = useState<UserRewards | null>(null)
  const timestamp = Date.now()

  const apply = (id: string) => {
    if (userRewards) {
      const current = { ...userRewards }
      current[id] = false
      setUserRewards(current)
    }
  }

  const revoke = (id: string) => {
    if (userRewards) {
      const current = { ...userRewards }
      delete current[id]
      setUserRewards(current)
    }
  }

  const claim = (id: string) => {
    if (userRewards) {
      const current = { ...userRewards }

      if (current[id] !== undefined) {
        current[id] = true
        setUserRewards(current)
      }
    }
  }

  const userFetch = () => {
    fetch(endpoint("users", "get", route.parameter)).then((response) => {
      response.json().then((result) => {
        const user: UserModel = result.data

        setUser(user)
        setName(user.name)
        setEmail(user.email)
        setUserRewards(JSON.parse(user.rewards))
      })
    })
  }

  const userUpdate = async () => {
    if (user) {
      try {
        await fetch(endpoint("users", "update", user.id), {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            rewards: JSON.stringify(userRewards),
          }),
        })
        toast.success("Succesfully updated user!")
      } catch (error) {
        toast.error("Could not update user!")
      }

      userFetch()
    }
  }

  useEffect(userFetch, [rewards, route.parameter])

  return user && route.parameter ? (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="name"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Name
      </label>
      <div>
        <input
          type="text"
          name="name"
          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="John Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Email
      </label>
      <div>
        <input
          type="email"
          name="email"
          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      {userRewards ? (
        <>
          <label
            htmlFor="rewards"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Rewards
          </label>
          <div>
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Description
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Expires
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {rewards.map((reward) => {
                        const userReward = userRewards[reward.id]
                        return (
                          <tr key={reward.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {reward.name}
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {reward.description}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(reward.expires).toLocaleDateString(
                                "en-AU",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </td>
                            <td className="flex flex-row gap-2 justify-end relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              {timestamp < reward.expires &&
                              userReward === undefined ? (
                                <button
                                  onClick={() => apply(reward.id)}
                                  className="py-2 px-3 border rounded-lg border-blue-500 text-blue-500"
                                >
                                  Apply
                                </button>
                              ) : null}
                              {timestamp < reward.expires &&
                              userReward !== undefined &&
                              !userReward ? (
                                <>
                                  <button
                                    onClick={() => revoke(reward.id)}
                                    className="py-2 px-3 border rounded-lg border-blue-500 text-blue-500"
                                  >
                                    Revoke
                                  </button>
                                  <button
                                    onClick={() => claim(reward.id)}
                                    className="py-2 px-3 border rounded-lg border-blue-500 text-blue-500"
                                  >
                                    Claim
                                  </button>
                                </>
                              ) : null}
                              {userReward !== undefined && userReward ? (
                                <div className="p-2 text-green-500">
                                  Claimed
                                </div>
                              ) : null}
                              {timestamp > reward.expires ? (
                                <div className="p-2 text-red-500">Expired</div>
                              ) : null}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
      <button
        type="button"
        className="block transition-colors rounded-md bg-blue-600 px-3 py-2 text-center text-sm text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => userUpdate()}
      >
        Save
      </button>
    </div>
  ) : (
    <div>
      <p>Missing/Invalid User</p>
    </div>
  )
}

export default UserDashboard
