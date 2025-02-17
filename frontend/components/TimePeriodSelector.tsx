"use client"

import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

const periods = [
  { label: "Last Week", value: "week" },
  { label: "Last Month", value: "month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Last Year", value: "year" },
  { label: "All Time", value: "all" }
]

export function TimePeriodSelector({ currentPeriod = 'all' }: { currentPeriod?: string }) {
  const router = useRouter()

  return (
    <div className="flex gap-4 mb-8 text-2xl">
      {periods.map(({ label, value }) => (
        <Button
          key={value}
          variant={currentPeriod === value ? "default" : "outline"}
          onClick={() => {
            router.push(`?period=${value}`)
          }}
          className="text-xl px-6 py-3 h-auto"
        >
          {label}
        </Button>
      ))}
    </div>
  )
} 