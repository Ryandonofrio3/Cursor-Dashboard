"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from "framer-motion"

const COLORS = ['#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080'];

interface CategoriesChartProps {
  data: {
    category: string;
  }[];
}

export function CategoriesChart({ data }: CategoriesChartProps) {
  const categoryData = useMemo(() => {
    const categories = data.reduce((acc: {[key: string]: number}, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {});

    const totalPosts = data.length;
    const threshold = totalPosts * 0.08;

    // Convert to array and filter small categories into "Other"
    const entries = Object.entries(categories);
    const otherValue = entries
      .filter(([_, value]) => value < threshold)
      .reduce((sum, [_, value]) => sum + value, 0);
    
    const significantCategories = entries
      .filter(([_, value]) => value >= threshold)
      .map(([name, value]) => ({
        name,
        value
      }));

    if (otherValue > 0) {
      significantCategories.push({
        name: 'Other',
        value: otherValue
      });
    }

    return significantCategories;
  }, [data]);

  console.log('Original Data:', data);
  console.log('Processed Category Data:', categoryData);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.4; // Increase this multiplier to push labels further out
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

  const memoizedPieChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={categoryData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100} // Slightly reduced radius to make room for labels
          fill="#8884d8"
          labelLine={true}
          label={renderCustomizedLabel}
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#dedede',
            border: '1px solid #333333',
            borderRadius: '6px',
            padding: '12px'
          }}
          labelStyle={{ color: '#ffffff' }}
        />
      </PieChart>
    </ResponsiveContainer>
  ), [categoryData]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8}}
    >
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Post Categories Distribution</h2>
        <div className="h-[400px] w-full">
          {memoizedPieChart}
        </div>
      </Card>
    </motion.div>
  );
}
