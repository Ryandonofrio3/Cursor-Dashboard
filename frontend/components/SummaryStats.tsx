"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface SummaryStatsProps {
  totalComments: number;
  avgReplies: number;
  avgLikes: number;
  totalPosts: number;
  uniqueUsers: number;
  changes: {
    totalComments: number;
    avgReplies: number;
    avgLikes: number;
    totalPosts: number;
    uniqueUsers: number;
  };
}

export function SummaryStats({
  totalComments,
  avgReplies,
  avgLikes,
  totalPosts,
  uniqueUsers,
  changes,
}: SummaryStatsProps) {
  const stats = [
    { 
      label: "Total Comments",
      value: totalComments,
      change: changes.totalComments,
    },
    { 
      label: "Avg Replies",
      value: avgReplies,
      change: changes.avgReplies,
    },
    { 
      label: "Avg Likes",
      value: avgLikes,
      change: changes.avgLikes,
    },
    { 
      label: "Total Posts",
      value: totalPosts,
      change: changes.totalPosts,
    },
    { 
      label: "Unique Users",
      value: uniqueUsers,
      change: changes.uniqueUsers,
    },
  ];

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center items-center text-white text-2xl sm:text-3xl font-bold mb-4 sm:mb-8"
      >
        <h1 className="text-white text-center px-4">
          Cursor Forum Analytics Dashboard
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 mb-4 sm:mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-3 sm:p-6 bg-black hover:bg-zinc-900 transition-all duration-300 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700">
              <div className="flex flex-col items-center space-y-1 sm:space-y-2">
                <h3 className="text-xs sm:text-sm text-zinc-400 font-medium text-center">{stat.label}</h3>
                <p className="text-xl sm:text-3xl font-bold text-white">
                  {stat.value.toLocaleString()}
                </p>
               
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}