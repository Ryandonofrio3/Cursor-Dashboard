"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from "framer-motion"

const COLORS = {
  positive: '#A8A8A8', // Light gray
  negative: '#4A4A4A', // Dark gray
  neutral: '#787878'  // Medium gray
};

interface SentimentChartProps {
  data: {
    sentiment: string;
  }[];
}

export function SentimentChart({ data }: SentimentChartProps) {
  const sentimentData = useMemo(() => {
    const sentiments = data.reduce((acc: {[key: string]: number}, post) => {
      acc[post.sentiment] = (acc[post.sentiment] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(sentiments).map(([name, value]) => ({
      name,
      value,
      percentage: (value / data.length * 100).toFixed(1)
    }));
  }, [data]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Post Sentiment Distribution</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sentimentData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={true}
                label={renderCustomizedLabel}
              >
                {sentimentData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.name}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#dedede',
                  border: '1px solid #333333',
                  borderRadius: '6px',
                  padding: '12px'
                }}
                labelStyle={{ color: '#000000' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 