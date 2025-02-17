"use client"

import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function UserActivityChart({ userActivity }: { userActivity: any[] }) {
  return (
    <Card className="p-6 bg-black text-white border border-zinc-800 relative z-10">
      <h2 className="text-xl font-semibold mb-6">Most Active Users</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={userActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis 
              dataKey="username" 
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickFormatter={(value) => value.slice(0, 8)}
            />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} width={40} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                color: '#fff',
                zIndex: 20
              }}
              labelStyle={{ color: '#fff' }}
            />
            <Bar dataKey="likes" fill="#fff" opacity={0.9} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 