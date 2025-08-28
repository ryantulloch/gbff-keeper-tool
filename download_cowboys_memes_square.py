#!/usr/bin/env python3
"""
Download 20 Dallas Cowboys "We Dem Boys" memes
Keep them as squares without squishing
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os
from PIL import Image

def download_cowboys_memes_square():
    """
    Download and resize Cowboys memes to squares
    """
    
    # Create download folder
    download_dir = Path("cowboys_memes_square")
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DOWNLOADING: Dallas Cowboys 'We Dem Boys' Memes")
    print("Target: 20 memes as 720x720 squares")
    print("=" * 50)
    
    target_size = (720, 720)  # Square format
    num_images = 20
    
    # Download extra to account for filtering
    download_extra = 40
    
    print(f"\n1. Downloading up to {download_extra} memes...")
    
    # Multiple search terms for variety of memes
    search_terms = [
        "We Dem Boys Dallas Cowboys meme",
        "Dallas Cowboys We Dem Boys funny",
        "Cowboys Nation We Dem Boys meme",
        "Dallas Cowboys meme playoffs We Dem Boys"
    ]
    
    current_count = 0
    for search in search_terms:
        if current_count >= download_extra:
            break
            
        print(f"\nSearching: {search}")
        bing_crawler = BingImageCrawler(
            downloader_threads=4,
            storage={'root_dir': str(download_dir)}
        )
        
        try:
            bing_crawler.crawl(
                keyword=search,
                max_num=10,
                min_size=(400, 400),  # Minimum size for meme quality
                file_idx_offset='auto'
            )
            current_count += 10
        except Exception as e:
            print(f"Error: {e}")
    
    print("\n2. Processing and making memes square...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    kept_images = []
    for img_path in image_files:
        if len(kept_images) >= num_images:
            break
            
        try:
            # Open image
            img = Image.open(img_path)
            width, height = img.size
            
            # Create square canvas with white background
            square_size = max(width, height)
            square_img = Image.new('RGB', (square_size, square_size), 'white')
            
            # Paste original image centered
            x_offset = (square_size - width) // 2
            y_offset = (square_size - height) // 2
            square_img.paste(img, (x_offset, y_offset))
            
            # Resize to target size
            img_resized = square_img.resize(target_size, Image.Resampling.LANCZOS)
            
            # Save with new name
            new_name = download_dir / f"cowboys_meme_{len(kept_images)+1:03d}.jpg"
            img_resized.save(new_name, 'JPEG', quality=95)
            kept_images.append(new_name)
            print(f"[OK] Processed: {img_path.name} ({width}x{height}) -> {target_size[0]}x{target_size[1]} square")
            
            # Close and delete original
            img.close()
            try:
                img_path.unlink()
            except:
                pass
                
        except Exception as e:
            print(f"Error processing {img_path.name}: {e}")
            try:
                img_path.unlink()
            except:
                pass
    
    # Clean up any remaining unnamed files
    for f in download_dir.glob("0*.jpg"):
        try:
            f.unlink()
        except:
            pass
    for f in download_dir.glob("0*.png"):
        try:
            f.unlink()
        except:
            pass
    
    print("\n" + "=" * 50)
    print(f"DOWNLOAD COMPLETE!")
    print(f"Total Cowboys memes: {len(kept_images)}")
    print(f"All memes as squares: {target_size[0]}x{target_size[1]}")
    print(f"Location: {download_dir.absolute()}")
    print("\nMemes are padded with white to maintain aspect ratio")
    print("You can manually select your favorite 10 from these 20!")
    print("=" * 50)
    
    return len(kept_images)

if __name__ == "__main__":
    download_cowboys_memes_square()