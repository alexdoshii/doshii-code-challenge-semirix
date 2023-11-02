import { Trophy } from "@phosphor-icons/react"

interface RewardChitProps {
  name: string
  claimed: boolean
  expires: number
}

const RewardChit = ({ name, claimed, expires }: RewardChitProps) => {
  const timestamp = Date.now()

  return (
    <div className="inline-flex items-center rounded-lg p-2 gap-2 flex-row text-yellow-500 bg-yellow-50 mr-2">
      <Trophy size={24} weight="duotone" />
      <span className="text-xs">
        <strong>{name}</strong>
        {claimed ? " - Claimed" : null}
        {timestamp > expires ? " - Expired" : null}
      </span>
    </div>
  )
}

export default RewardChit
