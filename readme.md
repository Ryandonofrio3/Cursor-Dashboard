# Sentiment Analysis Dashboard

To build this dashboard I scraped the last 1000 posts from the Cursor forum.
Then I used nltk to classify the sentiment of each post.

To build the frontend I used Next.js, Shadcn, TailwindCSS, and Framer Motion.

The "backend" is simply a large json file that contains the scraped data.

Future directions:
- Implement real-time scraping and data updates using a proper backend API
- Implement incremental scraping to only fetch new posts/comments
- Enhanced sentiment analysis using transformer models like BERT
- Topic modeling to identify emerging discussion themes
- Add search functionality across posts and comments
- Add user engagement metrics and community health indicators
- Create an API endpoint for programmatic access to forum analytics
- Add export functionality for custom date ranges and metrics

