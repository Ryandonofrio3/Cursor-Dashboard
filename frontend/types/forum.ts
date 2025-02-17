export interface Comment {
  username: string
  timestamp: string
  relative_time: string
  text: string
  likes: number
}

export interface ForumPost {
  title: string
  url: string
  category: string
  replies: string
  last_active: string
  posters: any[]
  sentiment: string
  comments: Comment[]
}

export type ForumData = ForumPost[] 