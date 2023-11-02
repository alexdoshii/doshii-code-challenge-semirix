import { MouseEventHandler, ReactNode } from "react"

interface IconButtonProps {
  icon: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <button
      className={`rounded-lg transition-colors p-2 bg-gray-100 hover:bg-blue-100 active:bg-blue-200 text-gray-700 hover:text-blue-500`}
      onClick={onClick}
    >
      {icon}
    </button>
  )
}

export default IconButton
