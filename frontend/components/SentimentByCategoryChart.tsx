"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from "framer-motion"

interface SentimentByCategoryChartProps {
  data: {
    category: string;
    sentiment: string;
  }[];
}

export function SentimentByCategoryChart({ data }: SentimentByCategoryChartProps) {
  const chartData = useMemo(() => {
    const categoryStats = data.reduce((acc: { [key: string]: { 
      positive: number, 
      negative: number, 
      neutral: number,
      total: number 
    }}, post) => {
      if (!acc[post.category]) {
        acc[post.category] = { positive: 0, negative: 0, neutral: 0, total: 0 };
      }
      acc[post.category][post.sentiment as keyof typeof acc[string]]++;
      acc[post.category].total++;
      return acc;
    }, {});

    // Convert to percentage-based data
    return Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        positive: (stats.positive / stats.total) * 100,
        negative: (stats.negative / stats.total) * 100,
        neutral: (stats.neutral / stats.total) * 100
      }))
      .sort((a, b) => b.positive - a.positive); // Sort by positive sentiment
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Sentiment Distribution by Category</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100 // Increased bottom margin to accommodate labels
              }}
            >
              <Legend verticalAlign="top" height={36}/>
              <XAxis 
                dataKey="category" 
                angle={-45}
                textAnchor="end"
                height={100} // Increased height for labels
                interval={0} // Show all labels
                stroke="white"
                tick={{
                  fill: 'white',
                  fontSize: 12,
                  dy: 10 // Adjust vertical position of labels
                }}
              />
              <YAxis 
                stroke="white"
                label={{ 
                  value: 'Percentage', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fill: 'white' }
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333333',
                  borderRadius: '6px',
                  padding: '12px'
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`]}
              />
              <Bar 
                dataKey="positive" 
                fill="#A8A8A8" 
                name="Positive"
                stackId="stack"
              />
              <Bar 
                dataKey="neutral" 
                fill="#787878" 
                name="Neutral"
                stackId="stack"
              />
              <Bar 
                dataKey="negative" 
                fill="#4A4A4A" 
                name="Negative"
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
} 