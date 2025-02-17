import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { ForumData } from '@/types/forum'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    // Get the path to the JSON file - looking in same current api/forum-data folder
    // frontend/app/api/forum-data/cursor_posts_final.json
    const jsonPath = "/Users/ryandonofrio/Desktop/cursor_dash/frontend/app/api/forum-data/cursor_posts_final.json"
    
    // Read the JSON file
    const jsonData = await fs.readFile(jsonPath, 'utf8')
    
    // Parse the JSON data
    const data = JSON.parse(jsonData) as ForumData
    
    // Return the data with proper headers
    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error reading forum data:', error)
    return NextResponse.json(
      { error: 'Failed to load forum data' },
      { status: 500 }
    )
  }
} 