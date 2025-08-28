#!/usr/bin/env python3
"""
Download Micah Parsons images using icrawler
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os

def download_with_icrawler():
    """
    Use icrawler to download images from Bing and Google
    """
    
    # Create download folder
    download_dir = Path("micah_parsons_images")
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DOWNLOADING MICAH PARSONS IMAGES WITH ICRAWLER")
    print("=" * 50)
    
    # Count existing images
    existing = len(list(download_dir.glob("*.jpg")))
    print(f"Existing images: {existing}")
    
    needed = 30 - existing
    if needed <= 0:
        print("Already have 30 images!")
        return
    
    print(f"Need to download: {needed} more images")
    print("-" * 50)
    
    # Try Bing first (usually more reliable)
    print("\n1. Trying Bing Image Search...")
    bing_crawler = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler.crawl(
            keyword='Micah Parsons face close up Cowboys headshot',
            max_num=15,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("Bing search complete")
    except Exception as e:
        print(f"Bing error: {e}")
    
    # Try different search term
    print("\n2. Trying another Bing search...")
    bing_crawler2 = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        bing_crawler2.crawl(
            keyword='Micah Parsons portrait Cowboys helmet',
            max_num=15,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("Second Bing search complete")
    except Exception as e:
        print(f"Bing error: {e}")
    
    # Try Google as backup
    print("\n3. Trying Google Image Search...")
    google_crawler = GoogleImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        google_crawler.crawl(
            keyword='Micah Parsons face smile Cowboys',
            max_num=15,
            min_size=(200, 200),
            file_idx_offset='auto'
        )
        print("Google search complete")
    except Exception as e:
        print(f"Google error: {e}")
    
    # Rename files to our naming convention
    print("\n4. Renaming files...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    for i, file in enumerate(image_files[:30], 1):
        new_name = download_dir / f"micah_parsons_{i:03d}.jpg"
        if not new_name.exists():
            try:
                file.rename(new_name)
                print(f"Renamed to: {new_name.name}")
            except:
                pass
    
    # Final count
    final_count = len(list(download_dir.glob("micah_parsons_*.jpg")))
    
    print("\n" + "=" * 50)
    print(f"DOWNLOAD COMPLETE!")
    print(f"Total images: {final_count}")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return final_count

if __name__ == "__main__":
    count = download_with_icrawler()
    
    if count < 30:
        print(f"\nNote: Only downloaded {count} images.")
        print("The crawler may be hitting rate limits.")
        print("You can run the script again to try to get more.")