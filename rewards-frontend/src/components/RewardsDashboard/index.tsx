import { RootState } from "@/store"
import { useSelector } from "react-redux"
import IconButton from "../IconButton"
import { Pencil, X } from "@phosphor-icons/react"
import { PageProps } from "../Main"
import Search from "../Search"
import { RewardModel } from "@/models/rewards"
import { useState } from "react"
import { endpoint } from "@/utils"

interface RewardsDashboardProps extends PageProps {}

const RewardsDashboard = ({ setRoute }: RewardsDashboardProps) => {
  const rewards = useSelector((state: RootState) => state.rewards.list)
  const [search, setSearch] = useState<RewardModel[] | null>(null)
  const results = search ? search : rewards

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <Search
            onChange={({ text, option }) => {
              if (text.length) {
                fetch(
                  endpoint("search", "rewards", option.toLowerCase(), text),
                  {
                    method: "post",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                  }
                ).then((response) =>
                  response.json().then((result) => setSearch(result.data))
                )
              } else {
                setSearch(null)
              }
            }}
            options={["Name", "Description"]}
          />
        </div>
      </div>
      <div className="mt-8 flow-root">
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
                  {results.map((reward) => (
                    <tr key={reward.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {reward.name}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {reward.description}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(reward.expires).toLocaleDateString("en-AU", {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="flex flex-row gap-2 justify-end relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <IconButton
                          icon={<Pencil size={24} />}
                          onClick={() =>
                            setRoute({ page: "reward", parameter: reward.id })
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardsDashboard
