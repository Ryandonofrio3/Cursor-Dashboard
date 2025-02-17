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
    <div className="flex gap-2 mb-6">
      {periods.map(({ label, value }) => (
        <Button
          key={value}
          variant={currentPeriod === value ? "default" : "outline"}
          onClick={() => {
            router.push(`?period=${value}`)
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  )
} 