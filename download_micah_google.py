#!/usr/bin/env python3
"""
Download Micah Parsons images using Google Images Download alternative
"""

import os
import requests
import json
import time
from pathlib import Path
import urllib.parse

def download_from_google_images():
    """
    Download images using Google Custom Search API approach
    """
    
    # Create download folder
    download_dir = Path("micah_parsons_images")
    download_dir.mkdir(exist_ok=True)
    
    print("Downloading 30 Micah Parsons images...")
    print("=" * 50)
    
    # Multiple search terms for variety
    search_terms = [
        "Micah Parsons Cowboys",
        "Micah Parsons Dallas football",
        "Micah Parsons NFL game",
        "Micah Parsons sack",
        "Micah Parsons Cowboys tackle",
        "Micah Parsons Cowboys 2023",
        "Micah Parsons Cowboys 2024"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    downloaded = 0
    target = 30
    
    for search_query in search_terms:
        if downloaded >= target:
            break
            
        print(f"\nSearching: {search_query}")
        
        # Use DuckDuckGo image search (more accessible than Google)
        encoded_query = urllib.parse.quote(search_query)
        search_url = f"https://duckduckgo.com/?q={encoded_query}&t=h_&iax=images&ia=images"
        
        # Get DuckDuckGo token
        vqd_url = f"https://duckduckgo.com/?q={encoded_query}&t=h_&iax=images&ia=images"
        
        try:
            # First request to get token
            response = requests.get(vqd_url, headers=headers)
            
            # Extract vqd token from response
            import re
            vqd_match = re.search(r'vqd=([\d-]+)', response.text)
            if not vqd_match:
                vqd_match = re.search(r'"vqd":"([\d-]+)"', response.text)
            
            if vqd_match:
                vqd = vqd_match.group(1)
                
                # Now get actual images
                images_url = f"https://duckduckgo.com/i.js?l=us-en&o=json&q={encoded_query}&vqd={vqd}&f=,,,&p=1"
                
                img_response = requests.get(images_url, headers=headers)
                
                if img_response.status_code == 200:
                    try:
                        data = img_response.json()
                        results = data.get('results', [])
                        
                        for result in results[:10]:  # Get up to 10 per search
                            if downloaded >= target:
                                break
                                
                            img_url = result.get('image')
                            if img_url:
                                try:
                                    print(f"Downloading image {downloaded + 1}/{target}...", end=" ")
                                    
                                    img_data = requests.get(img_url, headers=headers, timeout=5)
                                    
                                    if img_data.status_code == 200:
                                        filename = f"micah_parsons_{downloaded + 1:03d}.jpg"
                                        filepath = download_dir / filename
                                        
                                        with open(filepath, 'wb') as f:
                                            f.write(img_data.content)
                                        
                                        print(f"OK - {filename}")
                                        downloaded += 1
                                    else:
                                        print("Failed")
                                        
                                except Exception as e:
                                    print(f"Error: {str(e)[:30]}")
                                
                                time.sleep(0.3)
                                
                    except json.JSONDecodeError:
                        print("Could not parse image results")
                        
        except Exception as e:
            print(f"Search error: {e}")
        
        time.sleep(1)  # Delay between searches
    
    print("\n" + "=" * 50)
    print(f"Download Complete!")
    print(f"Successfully downloaded: {downloaded} images")
    print(f"Saved to: {download_dir.absolute()}")
    
    if downloaded < target:
        print(f"\nOnly got {downloaded} images. Trying alternative method...")
        download_with_serpapi(download_dir, downloaded, target)
    
    return downloaded

def download_with_serpapi(download_dir, start_count, target):
    """
    Alternative using SerpAPI (requires free API key)
    """
    print("\n" + "=" * 50)
    print("Alternative: Using direct image URLs")
    print("=" * 50)
    
    # Direct URLs from various sources
    # These are example URLs - in production you'd scrape these
    direct_urls = [
        "https://www.dallascowboys.com/sites/dallascowboys.com/files/styles/open_graph__large/public/2023-10/micah_parsons_1920x1080.jpg",
        "https://static.www.nfl.com/image/private/t_editorial_landscape_12_desktop/league/mhccq6gcrjxowglfsybo",
        "https://cdn.vox-cdn.com/thumbor/8rS5N5t0SVgSs1DJLDzDPdXMqHo=/0x0:4928x3280/1200x800/filters:focal(2071x1247:2857x2033)/cdn.vox-cdn.com/uploads/chorus_image/image/72762655/1434777085.0.jpg",
        # Add more URLs here
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    downloaded = start_count
    
    for i, url in enumerate(direct_urls):
        if downloaded >= target:
            break
            
        try:
            print(f"Downloading {downloaded + 1}/{target}...", end=" ")
            response = requests.get(url, headers=headers, timeout=10)
            
            if response.status_code == 200:
                filename = f"micah_parsons_{downloaded + 1:03d}.jpg"
                filepath = download_dir / filename
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                print(f"OK - {filename}")
                downloaded += 1
            else:
                print("Failed")
                
        except Exception as e:
            print(f"Error: {str(e)[:30]}")
        
        time.sleep(0.5)
    
    return downloaded

if __name__ == "__main__":
    download_from_google_images()