import { useState } from "react"

interface Value {
  option: string
  text: string
}

interface SearchProps {
  options: string[]
  onChange?: (value: Value) => void
}

const Search = ({ options, onChange }: SearchProps) => {
  const [option, setOption] = useState(options[0])
  const [text, setText] = useState("")

  return (
    <div className="relative rounded-md shadow-sm">
      <input
        type="text"
        name="search"
        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        placeholder="Search..."
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          if (onChange) onChange({ option, text: event.target.value })
        }}
      />
      <div className="absolute inset-y-0 right-0 flex items-center">
        <label htmlFor="currency" className="sr-only">
          Options
        </label>
        <select
          name="options"
          className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-4 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
          value={option}
          onChange={(event) => {
            setOption(event.target.value)
            if (onChange) onChange({ option: event.target.value, text })
          }}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Search
