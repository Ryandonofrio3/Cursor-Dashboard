"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from './ui/button';

interface Comment {
  username: string;
  text: string;
  likes: number;
  timestamp: string;
}

interface TopLikedCommentsProps {
  data: Comment[];  
  timeframe: string;
}

export function TopLikedComments({ data, timeframe }: TopLikedCommentsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const sortedComments = data.sort((a, b) => b.likes - a.likes).slice(0, 10)

  const nextComment = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedComments.length)
  }

  const finalTimeframe = timeframe === 'all' ? 'all time' : timeframe

  const previousComment = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? sortedComments.length - 1 : prev - 1
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Most Liked Comments</h2>
        <div className="h-[400px] flex items-center justify-center">
          No comments available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
        <span className="flex items-center justify-center mb-4">
      <h2 className="text-2xl font-semibold text-center text-white inline-block">Most Liked Comments</h2>
      {timeframe == 'all' && (
        <p className="text-2xl text-center text-white inline-block ml-2">of {finalTimeframe}</p>
      )}
      {timeframe !== 'all' && (
        <p className="text-2xl text-center text-white inline-block ml-2">of the last {finalTimeframe}</p>
      )}
      </span>
      <div className="h-[400px] relative mt-2">
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button 
            onClick={previousComment}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button 
            onClick={nextComment}
            className="p-2 rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="h-full flex flex-col justify-center px-12"
          >
            <div className="text-center">
              <p className="text-xl mb-4 text-white px-2">{sortedComments[currentIndex].text}</p>
              <div className="flex justify-center items-center gap-4 text-base text-white">
                <span>by {sortedComments[currentIndex].username}</span>
                <span>•</span>
                <span>{sortedComments[currentIndex].likes} likes</span>
                <span>•</span>
                <span>{new Date(sortedComments[currentIndex].timestamp).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="mt-6 flex justify-center gap-2">
              {sortedComments.map((_, index) => (
                <Button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}