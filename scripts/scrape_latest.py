import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def get_full_page_content():
    # Set up Chrome in headless mode
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    
    try:
        # Load the page
        print("Loading page...")
        driver.get("https://forum.cursor.com/latest")
        
        # Initial wait for the page to load
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.CLASS_NAME, "topic-list-item"))
        )
        
        # Track number of posts
        posts_count = len(driver.find_elements(By.CLASS_NAME, "topic-list-item"))
        print(f"Initially loaded {posts_count} posts")
        
        # Scroll until we have at least 1000
        scroll_attempts = 0
        max_attempts = 15
        
        while scroll_attempts < max_attempts and posts_count < 1000:
            # Scroll to bottom
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            
            # Wait for new content to load
            time.sleep(2)
            
            # Count current posts
            current_posts = len(driver.find_elements(By.CLASS_NAME, "topic-list-item"))
            
            if current_posts > posts_count:
                print(f"Loaded {current_posts} posts...")
                posts_count = current_posts
                scroll_attempts = 0
            else:
                scroll_attempts += 1
        
        print(f"Finished loading {posts_count} posts")
        
        # Ensure the content is fully loaded
        time.sleep(2)
        return driver.page_source
        
    finally:
        driver.quit()

def scrape_latest_posts(html_content=None):
    if not html_content:
        html_content = get_full_page_content()
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Find all topic items
    topics = soup.find_all('tr', class_='topic-list-item')
    
    posts_data = []
    
    # Process only up to 1000 posts
    for topic in topics[:1000]:
        try:
            # Extract title and link
            title_elem = topic.find('a', class_='title')
            if not title_elem:
                continue
                
            title = title_elem.text.strip()
            url = f"https://forum.cursor.com{title_elem['href']}"
            
            # Extract category
            category_elem = topic.find('span', class_='badge-category__name')
            category = category_elem.text.strip() if category_elem else "Unknown"
            
            # Extract post stats
            replies_elem = topic.find('span', class_='number')
            replies = replies_elem.text.strip() if replies_elem else "0"
            

            # Extract date - find the last td element without a class
            date_elem = topic.find_all('td')[-1]
            date = date_elem.text.strip() if date_elem else "Unknown"
            
            # Extract posters
            posters = []
            poster_elements = topic.find_all('a', rel='nofollow')
            for poster in poster_elements:
                img_elem = poster.find('img')
                if img_elem and 'title' in img_elem.attrs:
                    title_parts = img_elem['title'].split(' - ')
                    username = title_parts[0]
                    role = title_parts[1] if len(title_parts) > 1 else "Participant"
                    posters.append({
                        "username": username,
                        "role": role
                    })
            
            post_data = {
                "title": title,
                "url": url,
                "category": category,
                "replies": replies,
                "last_active": date,
                "posters": posters
            }
            
            posts_data.append(post_data)
            
        except Exception as e:
            print(f"Error processing topic: {e}")
            continue
    
    return posts_data

def save_posts(posts, filename=None):
    if filename is None:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"cursor_latest_{timestamp}.json"
        
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
    
    return filename

if __name__ == "__main__":
    posts = scrape_latest_posts()
    filename = save_posts(posts)
    print(f"Scraped {len(posts)} posts and saved to {filename}")