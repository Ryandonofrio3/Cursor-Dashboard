import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import time

def scrape_cursor_forum(url):
    """Scrapes comments from a Cursor forum post page."""
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    comments = soup.find_all('div', class_='topic-body crawler-post')
    comment_data = []
    
    for comment in comments:
        if comment.get('role') == 'navigation':
            continue

        try:
            # Extract username
            creator = comment.find('span', class_='creator')
            if creator:
                name_elem = creator.find('span', itemprop="name")
                username = name_elem.get_text(strip=True) if name_elem else "Unknown"
            else:
                username = "Unknown"
            
            # Extract timestamp
            time_elem = comment.find('time', class_='post-time')
            timestamp = time_elem['datetime'] if time_elem and time_elem.has_attr('datetime') else None
            relative_time = time_elem.get_text(strip=True) if time_elem else ""
            
            # Extract comment text
            post_elem = comment.find('div', class_='post')
            if post_elem:
                paragraphs = post_elem.find_all('p')
                if paragraphs:
                    text = "\n".join(p.get_text(strip=True) for p in paragraphs)
                else:
                    text = post_elem.get_text(strip=True)
            else:
                text = ""
            
            # Extract likes
            likes_elem = comment.find('span', class_='post-likes')
            if likes_elem:
                likes_text = likes_elem.get_text(strip=True)
                parts = likes_text.split()
                likes = int(parts[0]) if parts and parts[0].isdigit() else 0
            else:
                likes = 0
            
            comment_obj = {
                "username": username,
                "timestamp": timestamp,
                "relative_time": relative_time,
                "text": text,
                "likes": likes
            }
            comment_data.append(comment_obj)
        
        except Exception as e:
            print(f"Error processing comment: {e}")
            continue
    
    return comment_data

def enrich_posts_with_comments(latest_file, max_posts=1000):
    """Takes the latest posts JSON and adds comments to each post."""
    
    # Load the original posts
    with open(latest_file, 'r') as f:
        posts = json.load(f)
    
    # Process only the first max_posts
    enriched_posts = []
    
    print(f"Processing {max_posts} posts...")
    
    for i, post in enumerate(posts[:max_posts]):
        if i % 5 == 0:  # Print progress every 5 posts
            print(f"Processing post {i+1}/{max_posts}")
            
        try:
            # Get comments for this post
            comments = scrape_cursor_forum(post['url'])
            
            # Add comments to the post data
            enriched_post = post.copy()
            enriched_post['comments'] = comments
            enriched_posts.append(enriched_post)
            
            # Be nice to the server
            time.sleep(0.5)
            
        except Exception as e:
            print(f"Error processing post {post['url']}: {e}")
            enriched_post = post.copy()
            enriched_post['comments'] = []
            enriched_posts.append(enriched_post)
            continue
    
    # Add any remaining posts without comments
    for post in posts[max_posts:]:
        post_copy = post.copy()
        post_copy['comments'] = []
        enriched_posts.append(post_copy)
    
    return enriched_posts

if __name__ == "__main__":
    # Input file (from scrape_latest.py)
    latest_file = "cursor_latest_20250216_153859.json"
    
    # Enrich the posts with comments
    enriched_posts = enrich_posts_with_comments(latest_file, max_posts=1000)
    
    # Save the enriched data
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"cursor_posts_with_comments_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(enriched_posts, f, indent=2, ensure_ascii=False)
    
    print(f"Saved {len(enriched_posts)} posts with comments to {filename}")


