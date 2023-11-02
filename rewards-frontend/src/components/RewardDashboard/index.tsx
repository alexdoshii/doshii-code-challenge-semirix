import { RootState } from "@/store"
import { useSelector } from "react-redux"
import { PageProps } from "../Main"
import { RewardModel } from "@/models/rewards"
import { endpoint } from "@/utils"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

interface RewardDashboardProps extends PageProps {}

const RewardDashboard = ({ route }: RewardDashboardProps) => {
  const rewards = useSelector((state: RootState) => state.rewards.list)
  const [reward, setReward] = useState<RewardModel | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [expires, setExpires] = useState(0)

  const rewardFetch = () => {
    fetch(endpoint("rewards", "get", route.parameter)).then((response) => {
      response.json().then((result) => {
        const reward: RewardModel = result.data

        setReward(reward)
        setName(reward.name)
        setDescription(reward.description)
        setExpires(reward.expires)
      })
    })
  }

  const rewardUpdate = async () => {
    if (reward) {
      try {
        await fetch(endpoint("rewards", "update", reward.id), {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            expires,
          }),
        })
        toast.success("Succesfully updated reward!")
      } catch (error) {
        toast.error("Could not update reward!")
      }

      rewardFetch()
    }
  }

  useEffect(rewardFetch, [rewards, route.parameter])

  return (
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
          placeholder="Reward"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <label
        htmlFor="description"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Description
      </label>
      <div>
        <input
          type="description"
          name="description"
          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
      <label
        htmlFor="expires"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Expires
      </label>
      <div>
        <input
          type="expires"
          name="expires"
          className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="you@example.com"
          value={expires}
          onChange={(event) => setExpires(parseInt(event.target.value))}
        />
      </div>
      <button
        type="button"
        className="block transition-colors rounded-md bg-blue-600 px-3 py-2 text-center text-sm text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => rewardUpdate()}
      >
        Save
      </button>
    </div>
  )
}

export default RewardDashboard
