import json
from datetime import datetime
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# Download required NLTK data (run once)
nltk.download('vader_lexicon')

def get_sentiment(text):
    """Analyze sentiment of text using NLTK's VADER sentiment analyzer."""
    sia = SentimentIntensityAnalyzer()
    sentiment_scores = sia.polarity_scores(text)
    
    # Classify based on compound score
    if sentiment_scores['compound'] >= 0.05:
        return 'positive'
    elif sentiment_scores['compound'] <= -0.05:
        return 'negative'
    else:
        return 'neutral'

def add_sentiment_to_posts(input_file):
    """Reads existing post data and adds sentiment analysis."""
    
    # Load the original posts
    with open(input_file, 'r') as f:
        posts = json.load(f)
    
    print(f"Processing {len(posts)} posts...")
    
    enriched_posts = []
    for i, post in enumerate(posts):
        if i % 10 == 0:  # Print progress every 10 posts
            print(f"Processing post {i+1}/{len(posts)}")
            
        enriched_post = post.copy()
        
        # Get the parent post text (first comment)
        if post.get('comments') and len(post['comments']) > 0:
            parent_post_text = post['comments'][0]['text']
            enriched_post['sentiment'] = get_sentiment(parent_post_text)
        else:
            enriched_post['sentiment'] = 'neutral'
            
        enriched_posts.append(enriched_post)
    
    return enriched_posts

if __name__ == "__main__":
    # Input file path
    input_file = "cursor_posts_final.json"  # Adjust this to your actual filename
    
    # Add sentiment analysis
    enriched_posts = add_sentiment_to_posts(input_file)
    
    # Save the enriched data
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"cursor_posts_with_sentiment_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(enriched_posts, f, indent=2, ensure_ascii=False)
    
    # Print some statistics
    sentiments = [post['sentiment'] for post in enriched_posts]
    total = len(sentiments)
    positive = sentiments.count('positive')
    negative = sentiments.count('negative')
    neutral = sentiments.count('neutral')
    
    print(f"\nSentiment Analysis Results:")
    print(f"Total Posts: {total}")
    print(f"Positive: {positive} ({(positive/total)*100:.1f}%)")
    print(f"Negative: {negative} ({(negative/total)*100:.1f}%)")
    print(f"Neutral: {neutral} ({(neutral/total)*100:.1f}%)")
    print(f"\nSaved enriched data to {filename}") 