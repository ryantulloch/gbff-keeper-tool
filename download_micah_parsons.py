#!/usr/bin/env python3
"""
Download 30 images of Micah Parsons in Cowboys jersey
"""

import os
import requests
import time
import uuid
from urllib.parse import urlparse

def download_images_simple():
    """
    Downloads images using Bing Image Search (no API key required)
    Using the bing-image-downloader package
    """
    try:
        from bing_image_downloader import downloader
    except ImportError:
        print("Installing bing-image-downloader...")
        os.system("pip install bing-image-downloader")
        from bing_image_downloader import downloader
    
    # Create downloads folder
    if not os.path.exists("micah_parsons_images"):
        os.makedirs("micah_parsons_images")
    
    print("🏈 Starting download of 30 Micah Parsons images...")
    
    # Download images
    downloader.download(
        "Micah Parsons Dallas Cowboys jersey game action",
        limit=30,
        output_dir="micah_parsons_images",
        adult_filter_off=True,
        force_replace=False,
        timeout=60,
        verbose=True
    )
    
    print("✅ Download complete! Check the 'micah_parsons_images' folder")

def download_images_manual():
    """
    Alternative method using direct image URLs
    Fallback if bing-image-downloader doesn't work
    """
    # Sample direct URLs - these would need to be actual Micah Parsons images
    # For demo purposes, using placeholder URLs
    print("🏈 Manual download method (requires finding actual image URLs)")
    
    # Create folder
    if not os.path.exists("micah_parsons_images"):
        os.makedirs("micah_parsons_images")
    
    # You would need to replace these with actual image URLs
    # These are just examples of the structure
    image_urls = [
        # Add 30 actual Micah Parsons image URLs here
        # Example: "https://example.com/micah-parsons-1.jpg",
    ]
    
    if not image_urls:
        print("⚠️  No image URLs provided in manual method")
        print("Please use the bing-image-downloader method instead (option 1)")
        return
    
    # Download each image
    for i, url in enumerate(image_urls, 1):
        try:
            response = requests.get(url, timeout=10)
            if response.status_code == 200:
                # Get file extension
                ext = os.path.splitext(urlparse(url).path)[1] or '.jpg'
                filename = f"micah_parsons_{i:02d}{ext}"
                filepath = os.path.join("micah_parsons_images", filename)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                print(f"✅ Downloaded {i}/30: {filename}")
            else:
                print(f"❌ Failed to download image {i}")
        except Exception as e:
            print(f"❌ Error downloading image {i}: {e}")
        
        # Small delay to be respectful
        time.sleep(0.5)

if __name__ == "__main__":
    print("=" * 50)
    print("MICAH PARSONS IMAGE DOWNLOADER")
    print("=" * 50)
    print("\nChoose download method:")
    print("1. Automatic (using bing-image-downloader) - RECOMMENDED")
    print("2. Manual (requires adding URLs manually)")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "2":
        download_images_manual()
    else:
        download_images_simple()
    
    print("\n" + "=" * 50)
    print("Download process complete!")
    print("Images saved to: micah_parsons_images/")
    print("=" * 50)