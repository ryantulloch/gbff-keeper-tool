#!/usr/bin/env python3
"""
Download square images or auto-crop to square (no resizing/stretching)
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os
from PIL import Image

def download_and_crop_square(search_terms, folder_name, num_images=30):
    """
    Download images and auto-crop them to squares
    """
    
    # Create download folder
    download_dir = Path(folder_name)
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print(f"DOWNLOADING: {search_terms[0]}")
    print(f"Target: {num_images} square images (auto-cropped, not resized)")
    print("=" * 50)
    
    # Download extra to account for processing
    download_extra = num_images + 20
    
    print(f"\n1. Downloading up to {download_extra} images...")
    
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
                min_size=(600, 600),  # Prefer larger images
                file_idx_offset='auto'
            )
            current_count += 15
        except Exception as e:
            print(f"Error: {e}")
    
    print("\n2. Auto-cropping to squares (center crop)...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    kept_images = []
    file_prefix = folder_name.replace("_square_crop", "")
    
    for img_path in image_files:
        if len(kept_images) >= num_images:
            break
            
        try:
            # Open image
            img = Image.open(img_path)
            width, height = img.size
            
            # Calculate square crop (center crop)
            min_dimension = min(width, height)
            
            # Skip if image is too small
            if min_dimension < 600:
                print(f"[SKIP] {img_path.name} - too small ({width}x{height})")
                img.close()
                img_path.unlink()
                continue
            
            # Center crop to square
            left = (width - min_dimension) // 2
            top = (height - min_dimension) // 2
            right = left + min_dimension
            bottom = top + min_dimension
            
            # Crop the image
            img_cropped = img.crop((left, top, right, bottom))
            
            # Save with new name (keeping original resolution, just cropped)
            new_name = download_dir / f"{file_prefix}_{len(kept_images)+1:03d}.jpg"
            img_cropped.save(new_name, 'JPEG', quality=95)
            kept_images.append(new_name)
            print(f"[OK] Cropped: {img_path.name} ({width}x{height}) -> {min_dimension}x{min_dimension} square")
            
            # Close and delete original
            img.close()
            img_cropped.close()
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
    print(f"Total images: {len(kept_images)}")
    print(f"All images auto-cropped to squares (center crop)")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return len(kept_images)

def main():
    """
    Download all the image sets as squares
    """
    
    # 1. Micah Parsons solo
    print("\n1. DOWNLOADING MICAH PARSONS SOLO IMAGES")
    download_and_crop_square(
        ["Micah Parsons Cowboys game", "Micah Parsons Dallas Cowboys action", "Micah Parsons Cowboys sack"],
        "micah_solo_square_crop",
        30
    )
    
    # 2. Jerry and Micah together
    print("\n2. DOWNLOADING JERRY & MICAH TOGETHER")
    download_and_crop_square(
        ["Micah Parsons Jerry Jones together Cowboys", "Jerry Jones with Micah Parsons"],
        "micah_jerry_square_crop",
        27
    )
    
    # 3. Cowboys memes
    print("\n3. DOWNLOADING COWBOYS MEMES")
    download_and_crop_square(
        ["We Dem Boys Dallas Cowboys meme", "Cowboys We Dem Boys funny"],
        "cowboys_memes_square_crop",
        20
    )

if __name__ == "__main__":
    # Do Jerry Jones solo
    download_and_crop_square(
        ["Jerry Jones Dallas Cowboys owner", "Jerry Jones face close up", "Jerry Jones Cowboys sideline", "Jerry Jones press conference"],
        "jerry_jones_solo_crop",
        20
    )