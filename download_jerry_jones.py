#!/usr/bin/env python3
"""
Download Jerry Jones face images using icrawler
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os

def download_jerry_jones():
    """
    Use icrawler to download Jerry Jones face images
    """
    
    # Create download folder
    download_dir = Path("jerry_jones_images")
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DOWNLOADING JERRY JONES FACE IMAGES")
    print("=" * 50)
    
    # Try Bing first
    print("\n1. Searching Bing for Jerry Jones face...")
    bing_crawler = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler.crawl(
            keyword='Jerry Jones face close up Cowboys owner',
            max_num=5,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("First search complete")
    except Exception as e:
        print(f"Bing error: {e}")
    
    # Try another search
    print("\n2. Searching for Jerry Jones portrait...")
    bing_crawler2 = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler2.crawl(
            keyword='Jerry Jones headshot Dallas Cowboys',
            max_num=5,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("Second search complete")
    except Exception as e:
        print(f"Bing error: {e}")
    
    # Rename files to our naming convention
    print("\n3. Renaming files...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    for i, file in enumerate(image_files[:10], 1):
        new_name = download_dir / f"jerry_jones_{i:03d}.jpg"
        if not new_name.exists():
            try:
                file.rename(new_name)
                print(f"Renamed to: {new_name.name}")
            except:
                pass
    
    # Final count
    final_count = len(list(download_dir.glob("jerry_jones_*.jpg")))
    
    print("\n" + "=" * 50)
    print(f"DOWNLOAD COMPLETE!")
    print(f"Total Jerry Jones images: {final_count}")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return final_count

if __name__ == "__main__":
    download_jerry_jones()