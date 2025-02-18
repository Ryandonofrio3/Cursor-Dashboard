import { ForumData, ForumPost, Comment } from '@/types/forum'
import { SummaryStats } from '@/components/SummaryStats'
import { CategoriesChart } from '@/components/CategoriesChart'
import { SentimentChart } from '@/components/SentimentChart'
import { SentimentByCategoryChart } from '@/components/SentimentByCategoryChart'
import { TopLikedComments } from '@/components/TopLikedComments'
import { TimePeriodSelector } from '@/components/TimePeriodSelector'
import { TrendingTopics } from '@/components/TrendingTopics'
import { ActivityTimeline } from '@/components/activity-timeline'
import { UserActivityChart } from '@/components/user-activity-chart'
import Image from 'next/image'

type Props = {
  searchParams: Promise<{
    period?: string
  }>
}

export default async function Home({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const period = resolvedSearchParams.period || 'all';
  
  // Get cutoff date based on period
  const now = new Date();
  let cutoffDate = new Date(0); // default to all time
  
  switch (period) {
    case "week":
      cutoffDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case "month":
      cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case "3months":
      cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case "year":
      cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Ensure the baseUrl includes a protocol
  const formattedBaseUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl}`;

  const response = await fetch(`${formattedBaseUrl}/api/forum-data`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'force-cache',
    next: {
      revalidate: 3600
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const posts = (await response.json()) as ForumData;

  // Filter posts based on cutoff date
  const filteredPosts = posts.filter(post => 
    new Date(post.comments[0].timestamp) >= cutoffDate
  );

  // Process timeline data with filtered posts
  const timelineData = filteredPosts.reduce((acc: any[], post: ForumPost) => {
    post.comments.forEach((comment: Comment) => {
      const date = new Date(comment.timestamp).toLocaleDateString();
      const existingDay = acc.find(d => d.date === date);
      
      if (existingDay) {
        existingDay.comments++;
        existingDay.likes += comment.likes;
      } else {
        acc.push({ date, comments: 1, likes: comment.likes });
      }
    });
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Process other data with filtered posts
  const categoryChartData = filteredPosts.map(post => ({
    category: post.category,
  }));

  const sentimentChartData = filteredPosts.map(post => ({
    sentiment: post.sentiment[0].toUpperCase() + post.sentiment.slice(1),
  }));


  const sentimentByCategoryData = filteredPosts.map(post => ({
    category: post.category,
    sentiment: post.sentiment,
  }));

  const topLikedComments = filteredPosts
    .flatMap(post => post.comments)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 10)
    .map(comment => ({
      text: comment.text,
      username: comment.username,
      likes: comment.likes,
      timestamp: comment.timestamp
    }));

  // Calculate summary stats from filtered data
  const totalPosts = filteredPosts.length;
  const totalComments = filteredPosts.reduce((acc, post) => acc + post.comments.length, 0);
  const avgReplies = Math.round(filteredPosts.reduce((acc, post) => acc + parseInt(post.replies), 0) / totalPosts);
  const avgLikes = Math.round(filteredPosts.reduce((acc, post) => acc + post.comments.reduce((cAcc, comment) => cAcc + comment.likes, 0), 0) / totalComments);
  const uniqueUsers = new Set(filteredPosts.flatMap(post => post.comments.map(comment => comment.username))).size;

  // Calculate stats for previous period for comparison
  const previousCutoffDate = new Date(cutoffDate.getTime() - (cutoffDate.getTime() - new Date(0).getTime()));
  const previousPosts = posts.filter(post => {
    const postDate = new Date(post.comments[0].timestamp);
    return postDate >= previousCutoffDate && postDate < cutoffDate;
  });

  const prevTotalPosts = previousPosts.length || 1; // Prevent division by zero
  const prevTotalComments = previousPosts.reduce((acc, post) => acc + post.comments.length, 0) || 1;
  const prevAvgReplies = Math.round(previousPosts.reduce((acc, post) => acc + parseInt(post.replies), 0) / prevTotalPosts);
  const prevAvgLikes = Math.round(previousPosts.reduce((acc, post) => acc + post.comments.reduce((cAcc, comment) => cAcc + comment.likes, 0), 0) / prevTotalComments);
  const prevUniqueUsers = new Set(previousPosts.flatMap(post => post.comments.map(comment => comment.username))).size || 1;

  // Calculate percentage changes
  const calculatePercentChange = (current: number, previous: number) => {
    return Math.round(((current - previous) / previous) * 100);
  };

  const changes = {
    totalComments: calculatePercentChange(totalComments, prevTotalComments),
    avgReplies: calculatePercentChange(avgReplies, prevAvgReplies),
    avgLikes: calculatePercentChange(avgLikes, prevAvgLikes),
    totalPosts: calculatePercentChange(totalPosts, prevTotalPosts),
    uniqueUsers: calculatePercentChange(uniqueUsers, prevUniqueUsers),
  };

  // Process all topics (removed the slice)
  const topicChanges = Object.entries(
    filteredPosts.reduce((acc: { [key: string]: { posts: number, recent: number } }, post) => {
      const category = post.category;
      const isRecent = new Date(post.comments[0].timestamp) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      if (!acc[category]) {
        acc[category] = { posts: 0, recent: 0 };
      }
      acc[category].posts++;
      if (isRecent) acc[category].recent++;
      
      return acc;
    }, {})
  )
    .map(([name, stats]) => ({
      name,
      posts: stats.posts,
      trend: Math.round((stats.recent / stats.posts) * 100)
    }))
    .sort((a, b) => b.trend - a.trend); // Keep sorting but remove slice

  return (
    <div>
      <div className="flex items-center gap-4 px-4 sm:px-8 mb-4 mt-12">
        <Image 
          src="/logo.jpeg" 
          alt="Cursor Logo" 
          width={100} 
          height={100}
          className="rounded-full"
        />
        <h1 className="text-3xl font-bold">Cursor Forum Analytics Dashboard</h1>
      </div>

    <div className="p-4 sm:p-8 bg-background text-foreground bg-black">
      <TimePeriodSelector currentPeriod={period} />
      <SummaryStats 
        totalComments={totalComments}
        avgReplies={avgReplies}
        avgLikes={avgLikes}
        totalPosts={totalPosts}
        uniqueUsers={uniqueUsers}
        changes={changes}
      />
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <ActivityTimeline timelineData={timelineData} />
        <UserActivityChart userActivity={topLikedComments} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6 min-h-[400px]">
        <CategoriesChart data={categoryChartData} />
        <SentimentChart data={sentimentChartData} />
        <SentimentByCategoryChart data={sentimentByCategoryData} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
        <TopLikedComments data={topLikedComments} timeframe={period} />
        <TrendingTopics topics={topicChanges} />
      </div>
    </div>
    </div>
  );
}
