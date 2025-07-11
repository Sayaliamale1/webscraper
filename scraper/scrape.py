# Web scraper script to collect data from multiple sources
import sys
import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient

# Determine source from command-line argument
source = sys.argv[1] if len(sys.argv) > 1 else "hn"

# Connect to local MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["scrapedb"]
collection = db["data"]
collection.delete_many({})  # clear old data

# Scrape Hacker News
if source == "hn":
    url = "https://news.ycombinator.com/"
    res = requests.get(url)
    soup = BeautifulSoup(res.text, 'html.parser')
    items = soup.select(".titleline a")
    for item in items:
        collection.insert_one({
            "title": item.text.strip(),
            "description": "News from Hacker News",
            "link": item['href']
        })

# Scrape BooksToScrape
elif source == "books":
    url = "https://books.toscrape.com/"
    response = requests.get(url)
    response.encoding = 'utf-8'  
    soup = BeautifulSoup(response.text, 'html.parser')
    books = soup.select("article.product_pod")
    for book in books:
        title = book.h3.a["title"]
        price = book.select_one(".price_color").text.strip()
        link = url + book.h3.a["href"]
        collection.insert_one({
            "title": title,
            "description": f"Price: {price}",
            "link": link
        })

print(f"Scraping from {source} complete.")
