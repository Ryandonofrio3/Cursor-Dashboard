"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function DashboardCharts({ timelineData, userActivity }: { 
  timelineData: any[], 
  userActivity: any[] 
}) {
  // Group data by month
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

  const memoizedTimeline = useMemo(() => (
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
        <YAxis 
          stroke="#fff"
          tick={{ fill: '#fff' }}
        />
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
        <Line 
          type="monotone" 
          dataKey="comments" 
          stroke="#fff" 
          strokeWidth={2}
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="likes" 
          stroke="#666" 
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  ), [monthlyData])

  const memoizedBarChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={userActivity}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
        <XAxis 
          dataKey="username" 
          stroke="#fff"
          tick={{ fill: '#fff' }}
          tickFormatter={(value) => value.slice(0, 8)}
        />
        <YAxis 
          stroke="#cb1010"
          tick={{ fill: '#fff' }}
          width={40}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1a1a1a', 
            border: 'none',
            borderRadius: '6px',
            padding: '12px',
            color: '#fff'
          }}
          labelStyle={{ color: '#fff' }}
        />
        <Bar 
          dataKey="comments" 
          fill="#881b1b" 
          opacity={0.9}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  ), [userActivity])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Activity Timeline</h2>
        <div className="h-[300px] w-full">
          {memoizedTimeline}
        </div>
      </Card>

      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Most Active Users</h2>
        <div className="h-[300px] w-full">
          {memoizedBarChart}
        </div>
      </Card>
    </div>
  )
} 