"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ActivityTimeline({ timelineData }: { timelineData: any[] }) {
  const monthlyData = useMemo(() => {
    return timelineData.reduce((acc: any[], item) => {
      const date = new Date(item.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      const existingMonth = acc.find(d => d.month === monthKey);
      if (existingMonth) {
        existingMonth.comments += item.comments;
        existingMonth.likes += item.likes;
      } else {
        acc.push({
          month: monthKey,
          comments: item.comments,
          likes: item.likes
        });
      }
      return acc;
    }, []).sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [timelineData]);

  return (
    <Card className="p-6 bg-black text-white border border-zinc-800">
      <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
            <XAxis 
              dataKey="month" 
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                  month: 'short',
                  year: '2-digit'
                });
              }}
            />
            <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a1a', 
                border: 'none',
                borderRadius: '6px',
                padding: '12px',
                color: '#fff'
              }}
              labelStyle={{ color: '#fff' }}
              labelFormatter={(value) => {
                const [year, month] = value.split('-');
                return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                });
              }}
            />
            <Line type="monotone" dataKey="comments" stroke="#fff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="likes" stroke="#666" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 