#!/usr/bin/env python3
"""
Download images of Jerry Jones and Micah Parsons together
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os

def download_jerry_micah_together():
    """
    Download images of Jerry Jones and Micah Parsons together
    """
    
    # Create download folder
    download_dir = Path("jerry_micah_together")
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DOWNLOADING JERRY JONES & MICAH PARSONS TOGETHER")
    print("=" * 50)
    
    # Try Bing first
    print("\n1. Searching for Jerry Jones and Micah Parsons together...")
    bing_crawler = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler.crawl(
            keyword='Jerry Jones Micah Parsons together Cowboys',
            max_num=5,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("First search complete")
    except Exception as e:
        print(f"Bing error: {e}")
    
    # Try another search
    print("\n2. Searching with different terms...")
    bing_crawler2 = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler2.crawl(
            keyword='Jerry Jones with Micah Parsons Dallas Cowboys',
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
        new_name = download_dir / f"jerry_micah_{i:03d}.jpg"
        if not new_name.exists():
            try:
                file.rename(new_name)
                print(f"Renamed to: {new_name.name}")
            except:
                pass
    
    # Final count
    final_count = len(list(download_dir.glob("jerry_micah_*.jpg")))
    
    print("\n" + "=" * 50)
    print(f"DOWNLOAD COMPLETE!")
    print(f"Total images of Jerry & Micah together: {final_count}")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return final_count

if __name__ == "__main__":
    download_jerry_micah_together()