#!/usr/bin/env python3
"""
Automatically download 30 Micah Parsons images using requests and BeautifulSoup
"""

import os
import requests
from pathlib import Path
import time
import re
import json

def download_images_from_bing():
    """
    Downloads images by scraping Bing image search results
    """
    
    # Create download folder
    download_dir = Path("micah_parsons_images")
    download_dir.mkdir(exist_ok=True)
    
    print("Downloading 30 Micah Parsons Cowboys images...")
    print("=" * 50)
    
    # Search queries for variety
    searches = [
        "Micah Parsons Cowboys game action",
        "Micah Parsons Dallas Cowboys sack",
        "Micah Parsons Cowboys tackle"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
    }
    
    all_image_urls = []
    
    for search_query in searches:
        print(f"\nSearching: {search_query}")
        
        # Format query for URL
        query = search_query.replace(' ', '+')
        
        # Bing Images URL
        url = f"https://www.bing.com/images/search?q={query}&form=HDRSC2&first=1&tsc=ImageBasicHover"
        
        try:
            # Get the page
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                # Find image URLs in the response using regex
                # Look for patterns like: "murl":"https://..."
                pattern = r'"murl":"(https?://[^"]+\.(?:jpg|jpeg|png)[^"]*)"'
                matches = re.findall(pattern, response.text, re.IGNORECASE)
                
                if not matches:
                    # Try alternative pattern
                    pattern = r'src="(https?://[^"]+\.(?:jpg|jpeg|png)[^"]*)"'
                    matches = re.findall(pattern, response.text, re.IGNORECASE)
                
                if not matches:
                    # Try another pattern for thumbnails
                    pattern = r'"turl":"(https?://[^"]+)"'
                    matches = re.findall(pattern, response.text, re.IGNORECASE)
                
                print(f"Found {len(matches)} image URLs")
                all_image_urls.extend(matches[:15])  # Take up to 15 from each search
                
            else:
                print(f"Failed to fetch search results (status {response.status_code})")
                
        except Exception as e:
            print(f"Error searching: {e}")
        
        time.sleep(1)  # Be respectful between searches
    
    # Remove duplicates and limit to 30
    all_image_urls = list(dict.fromkeys(all_image_urls))[:30]
    
    if not all_image_urls:
        print("\nNo image URLs found through web scraping.")
        print("Falling back to manual URL list...")
        # Fallback: Use direct URLs (you'd need to add real ones)
        all_image_urls = [
            # Add some direct image URLs here as fallback
            # Example: "https://example.com/micah-parsons.jpg"
        ]
    
    print(f"\nTotal unique URLs to download: {len(all_image_urls)}")
    print("=" * 50)
    
    # Download the images
    downloaded = 0
    failed = 0
    
    for i, img_url in enumerate(all_image_urls, 1):
        try:
            print(f"Downloading {i}/{len(all_image_urls)}...", end=" ")
            
            # Clean up the URL if needed
            if img_url.startswith('//'):
                img_url = 'https:' + img_url
            
            # Download with timeout
            img_response = requests.get(img_url, headers=headers, timeout=10, stream=True)
            
            if img_response.status_code == 200:
                # Generate filename
                filename = f"micah_parsons_{i:03d}.jpg"
                filepath = download_dir / filename
                
                # Save the image
                with open(filepath, 'wb') as f:
                    for chunk in img_response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                print(f"OK - {filename}")
                downloaded += 1
            else:
                print(f"Failed (status {img_response.status_code})")
                failed += 1
                
        except Exception as e:
            print(f"Error: {str(e)[:50]}")
            failed += 1
        
        time.sleep(0.5)  # Small delay between downloads
    
    print("\n" + "=" * 50)
    print(f"Download Complete!")
    print(f"Successfully downloaded: {downloaded} images")
    print(f"Failed: {failed} images")
    print(f"Saved to: {download_dir.absolute()}")
    print("=" * 50)
    
    return downloaded

if __name__ == "__main__":
    try:
        import requests
    except ImportError:
        print("Installing requests library...")
        os.system("pip install requests")
        import requests
    
    count = download_images_from_bing()
    
    if count == 0:
        print("\nAutomatic download failed.")
        print("Please try:")
        print("1. Running the PowerShell script to open browser tabs")
        print("2. Manually saving images from the browser")
        print("3. Or finding direct image URLs to add to this script")