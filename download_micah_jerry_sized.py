#!/usr/bin/env python3
"""
Download 27 images of Micah Parsons and Jerry Jones together
All resized to consistent 1280x720 HD size
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os
from PIL import Image

def download_micah_jerry_sized():
    """
    Download and resize images of Micah and Jerry together
    """
    
    # Create download folder
    download_dir = Path("micah_jerry_sized")
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print("DOWNLOADING: Micah Parsons & Jerry Jones Together")
    print("Target: 27 images at 1280x720 HD resolution")
    print("=" * 50)
    
    target_size = (1280, 720)
    target_aspect = target_size[0] / target_size[1]
    num_images = 27
    
    # Download extra to account for filtering
    download_extra = 50
    
    print(f"\n1. Downloading up to {download_extra} images...")
    
    # Multiple search terms for variety
    search_terms = [
        "Micah Parsons Jerry Jones together Cowboys",
        "Jerry Jones with Micah Parsons Dallas",
        "Micah Parsons Jerry Jones sideline Cowboys",
        "Jerry Jones Micah Parsons press conference"
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
                max_num=15,
                min_size=(800, 450),  # Minimum size for quality
                file_idx_offset='auto'
            )
            current_count += 15
        except Exception as e:
            print(f"Error: {e}")
    
    print("\n2. Processing and standardizing image sizes...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    kept_images = []
    for img_path in image_files:
        if len(kept_images) >= num_images:
            break
            
        try:
            # Open and check image
            img = Image.open(img_path)
            width, height = img.size
            aspect_ratio = width / height
            
            # Check if aspect ratio is close to target (within 25% tolerance for more images)
            if abs(aspect_ratio - target_aspect) / target_aspect <= 0.25:
                # Resize to exact target size
                img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
                
                # Save with new name
                new_name = download_dir / f"micah_jerry_{len(kept_images)+1:03d}.jpg"
                img_resized.save(new_name, 'JPEG', quality=95)
                kept_images.append(new_name)
                print(f"[OK] Processed: {img_path.name} ({width}x{height}) -> {target_size[0]}x{target_size[1]}")
                
                # Close and delete original
                img.close()
                try:
                    img_path.unlink()
                except:
                    pass
            else:
                print(f"[SKIP] {img_path.name} (aspect ratio {aspect_ratio:.2f} too different)")
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
    print(f"Total Micah & Jerry images: {len(kept_images)}")
    print(f"All images resized to: {target_size[0]}x{target_size[1]}")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return len(kept_images)

if __name__ == "__main__":
    download_micah_jerry_sized()