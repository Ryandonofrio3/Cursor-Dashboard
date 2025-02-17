"use client"

import { Card } from "./ui/card"
import { motion } from "framer-motion"

interface Topic {
  name: string;
  posts: number;
  trend: number; // percentage increase
}

export function TrendingTopics({ topics }: { topics: Topic[] }) {
  return (
    <Card className="p-6 bg-black text-white border border-zinc-800">
      <h2 className="text-2xl font-semibold mb-6">Change in Topics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {topics.map((topic) => (
          <motion.div
            key={topic.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-800/50 rounded-lg p-4"
          >
            <h3 className="font-medium text-lg mb-2">{topic.name}</h3>
            <div className="flex justify-between items-center">
              <p className="text-sm text-zinc-400">{topic.posts} posts</p>
              <p className={`text-sm ${topic.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {topic.trend >= 0 ? '+' : ''}{topic.trend}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
} 