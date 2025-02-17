"use client"

import { useMemo } from 'react'
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import dynamic from 'next/dynamic'

type Word = {
  text: string;
  value: number;
};

const ReactWordcloud = dynamic<{ words: Word[]; options: any; }>(() => import('react-wordcloud'), { 
  ssr: false,
  loading: () => <div>Loading...</div>
})

interface WordCloudProps {
  data: Word[];
}

export function WordCloud({ data }: WordCloudProps) {
  // Guard against empty or invalid data
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Most Common Words in Comments</h2>
        <div className="h-[400px] flex items-center justify-center">
          No data available
        </div>
      </Card>
    );
  }

  const options = {
    colors: [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ],
    enableTooltip: true,
    deterministic: true,
    fontFamily: 'var(--font-inter)',
    fontSizes: [12, 60],
    fontStyle: 'normal',
    fontWeight: 'normal',
    padding: 1,
    rotations: 3,
    rotationAngles: [0, 90],
    scale: 'sqrt',
    spiral: 'archimedean',
    transitionDuration: 1000,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 bg-black text-white border border-zinc-800">
        <h2 className="text-xl font-semibold mb-6">Most Common Words in Comments</h2>
        <div className="h-[400px]">
          <ReactWordcloud words={data} options={options} />
        </div>
      </Card>
    </motion.div>
  );
}