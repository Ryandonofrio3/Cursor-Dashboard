import json
import re
from collections import Counter
from nltk.corpus import stopwords
import nltk

# Download required NLTK data
nltk.download('stopwords')
nltk.download('punkt')

def process_text(text):
    # Convert to lowercase and split into words
    words = text.lower()
    # Remove special characters and numbers
    words = re.sub(r'[^a-zA-Z\s]', '', words)
    # Split into words
    words = words.split()
    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    words = [w for w in words if w not in stop_words and len(w) > 3]
    return words

def generate_word_frequencies(input_file):
    with open(input_file, 'r') as f:
        posts = json.load(f)

    # Collect all words from comments
    all_words = []
    for post in posts:
        for comment in post['comments']:
            words = process_text(comment['text'])
            all_words.extend(words)

    # Count word frequencies
    word_counts = Counter(all_words)
    
    # Get top 100 words
    top_words = word_counts.most_common(100)
    
    # Convert to format needed for word cloud
    word_frequencies = [{"text": word, "value": count} for word, count in top_words]

    # Save to JSON
    with open('word_frequencies.json', 'w') as f:
        json.dump(word_frequencies, f, indent=2)

if __name__ == "__main__":
    generate_word_frequencies("/Users/ryandonofrio/Desktop/cursor_dash/frontend/app/api/forum-data/cursor_posts_final.json")