import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime

def scrape_full_page(url):
    """
    Scrapes the entire page and returns the raw HTML content
    """
    response = requests.get(url)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Convert the full page HTML to a dictionary structure
    page_data = {
        "title": soup.title.string if soup.title else "",
        "url": url,
        "content": str(soup)  # Full HTML content
    }
    
    return page_data

if __name__ == "__main__":
    url = "https://forum.cursor.com/t/slow-requests-are-just-too-slow/49686"
    page_content = scrape_full_page(url)
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"cursor_full_page_comments_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(page_content, f, indent=2, ensure_ascii=False)
    
    print(f"Scraped full page and saved to {filename}")
