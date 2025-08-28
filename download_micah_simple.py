#!/usr/bin/env python3
"""
Simple Micah Parsons image downloader using Google Images
"""

import os
import requests
import time
import json
from pathlib import Path

def download_micah_parsons_images():
    """
    Downloads 30 Micah Parsons images using direct URLs
    """
    
    # Create download folder
    download_dir = Path("micah_parsons_images")
    download_dir.mkdir(exist_ok=True)
    
    print("🏈 Downloading 30 Micah Parsons Cowboys images...")
    print("=" * 50)
    
    # These are placeholder URLs - in a real scenario you'd scrape or use an API
    # For now, using a simple approach with numbered requests
    
    # Using a public image API (placeholder.com style approach)
    # Note: These will be placeholder images, replace with actual Micah Parsons URLs
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    downloaded = 0
    failed = 0
    
    # Sample list of actual image search URLs you could use
    # These would need to be replaced with real Micah Parsons image URLs
    sample_urls = [
        # You can manually add URLs here
        # Example format:
        # "https://example.com/micah-parsons-1.jpg",
        # "https://example.com/micah-parsons-2.jpg",
    ]
    
    if sample_urls:
        # Download from provided URLs
        for i, url in enumerate(sample_urls[:30], 1):
            try:
                print(f"Downloading image {i}/30...", end=" ")
                response = requests.get(url, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    filename = f"micah_parsons_{i:03d}.jpg"
                    filepath = download_dir / filename
                    
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    
                    print(f"✅ Saved as {filename}")
                    downloaded += 1
                else:
                    print(f"❌ Failed (status {response.status_code})")
                    failed += 1
                    
                time.sleep(0.5)  # Be respectful
                
            except Exception as e:
                print(f"❌ Error: {e}")
                failed += 1
    else:
        print("\n⚠️  No image URLs provided!")
        print("\nTo use this script, you need to:")
        print("1. Find 30 Micah Parsons image URLs")
        print("2. Add them to the 'sample_urls' list in the script")
        print("3. Run the script again")
        print("\nAlternatively, try using a different tool like:")
        print("- google_images_download")
        print("- Manual download from Google Images")
        print("- Web scraping with BeautifulSoup")
    
    print("\n" + "=" * 50)
    print(f"✅ Downloaded: {downloaded} images")
    print(f"❌ Failed: {failed} images")
    print(f"📁 Saved to: {download_dir.absolute()}")
    
    return downloaded

def create_powershell_downloader():
    """
    Creates a PowerShell script as an alternative download method
    """
    ps_script = '''# PowerShell script to download Micah Parsons images
# This opens Bing image search in browser for manual download

$searchUrl = "https://www.bing.com/images/search?q=Micah+Parsons+Dallas+Cowboys+jersey+game&count=35"

Write-Host "Opening Bing Images search for Micah Parsons..." -ForegroundColor Green
Write-Host "Please manually save 30 images to the micah_parsons_images folder" -ForegroundColor Yellow

# Create folder
New-Item -ItemType Directory -Force -Path "micah_parsons_images" | Out-Null

# Open browser
Start-Process $searchUrl

Write-Host "`nFolder created at: micah_parsons_images" -ForegroundColor Cyan
Write-Host "Save images there manually from the browser" -ForegroundColor Cyan
'''
    
    with open("download_micah_parsons.ps1", "w") as f:
        f.write(ps_script)
    
    print("\n📝 Created PowerShell script: download_micah_parsons.ps1")
    print("Run it with: powershell ./download_micah_parsons.ps1")

if __name__ == "__main__":
    print("=" * 50)
    print("MICAH PARSONS IMAGE DOWNLOADER - SIMPLE VERSION")
    print("=" * 50)
    
    # Try Python download
    count = download_micah_parsons_images()
    
    if count == 0:
        print("\n" + "=" * 50)
        print("ALTERNATIVE: Creating PowerShell helper script...")
        create_powershell_downloader()
        print("\nSince automatic download failed, you can:")
        print("1. Run the PowerShell script to open image search")
        print("2. Manually save 30 images")
        print("3. Or add real image URLs to this Python script")
    
    print("\n" + "=" * 50)