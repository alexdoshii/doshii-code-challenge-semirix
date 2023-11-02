import { RootState } from "@/store"
import { useSelector } from "react-redux"
import IconButton from "../IconButton"
import { Pencil, X } from "@phosphor-icons/react"
import RewardChit from "../RewardChit"
import Search from "../Search"
import { PageProps } from "../Main"
import { useState } from "react"
import { UserModel } from "@/models/users"
import { endpoint } from "@/utils"

interface UsersDashboardProps extends PageProps {}

const UsersDashboard = ({ setRoute }: UsersDashboardProps) => {
  const users = useSelector((state: RootState) => state.users.list)
  const rewards = useSelector((state: RootState) => state.rewards.list)
  const [search, setSearch] = useState<UserModel[] | null>(null)
  const results = search ? search : users

  return (
    <div className="flex flex-col gap-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <Search
            onChange={({ text, option }) => {
              if (text.length) {
                fetch(endpoint("search", "users", option.toLowerCase(), text), {
                  method: "post",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                }).then((response) =>
                  response.json().then((result) => setSearch(result.data))
                )
              } else {
                setSearch(null)
              }
            }}
            options={["Name", "Email"]}
          />
        </div>
      </div>
      <div className="flow-root">
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
                      Date of Birth
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Rewards
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
                  {results.map((user) => {
                    const userRewards = JSON.parse(user.rewards)
                    return (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {new Date(user.dob).toLocaleDateString("en-AU", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {Object.keys(userRewards).map((key) => {
                            const reward = rewards.find(
                              (reward) => reward.id.toString() === key
                            )

                            if (reward) {
                              return (
                                <RewardChit
                                  key={key}
                                  name={reward.name}
                                  claimed={userRewards[key]}
                                  expires={reward.expires}
                                />
                              )
                            } else {
                              return null
                            }
                          })}
                        </td>
                        <td className="flex flex-row gap-2 justify-end relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <IconButton
                            icon={<Pencil size={24} />}
                            onClick={() =>
                              setRoute({ page: "user", parameter: user.id })
                            }
                          />
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
    </div>
  )
}

export default UsersDashboard
