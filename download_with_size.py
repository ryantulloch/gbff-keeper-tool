#!/usr/bin/env python3
"""
Download images with consistent size requirements
"""

from icrawler.builtin import BingImageCrawler, GoogleImageCrawler
from pathlib import Path
import os
from PIL import Image

def download_images_with_size(keyword, folder_name, num_images=10, target_size=(1280, 720)):
    """
    Download images with specific size requirements
    
    Args:
        keyword: Search term
        folder_name: Folder to save images
        num_images: Number of images to download
        target_size: Target resolution (width, height) - will find similar aspect ratio
    """
    
    # Create download folder
    download_dir = Path(folder_name)
    download_dir.mkdir(exist_ok=True)
    
    print("=" * 50)
    print(f"DOWNLOADING: {keyword}")
    print(f"Target size: {target_size[0]}x{target_size[1]} (16:9 aspect ratio)")
    print("=" * 50)
    
    # Calculate target aspect ratio
    target_aspect = target_size[0] / target_size[1]
    
    # Try to download more than needed to account for filtering
    download_extra = num_images * 2
    
    print(f"\n1. Downloading up to {download_extra} images to filter...")
    bing_crawler = BingImageCrawler(
        downloader_threads=4,
        storage={'root_dir': str(download_dir)}
    )
    
    try:
        # Set minimum size to ensure quality
        # Using 16:9 aspect ratio common for HD images
        bing_crawler.crawl(
            keyword=keyword,
            max_num=download_extra,
            min_size=(1024, 576),  # Minimum HD ready
            max_size=(1920, 1080),  # Maximum Full HD
            file_idx_offset='auto'
        )
        print("Download complete")
    except Exception as e:
        print(f"Error: {e}")
    
    # Filter and resize images to consistent size
    print("\n2. Filtering and standardizing image sizes...")
    image_files = list(download_dir.glob("*.jpg")) + list(download_dir.glob("*.png")) + list(download_dir.glob("*.jpeg"))
    
    kept_images = []
    for img_path in image_files:
        try:
            # Open and check image
            img = Image.open(img_path)
            width, height = img.size
            aspect_ratio = width / height
            
            # Check if aspect ratio is close to target (within 20% tolerance)
            if abs(aspect_ratio - target_aspect) / target_aspect <= 0.2:
                # Resize to exact target size
                img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
                
                # Save with new name
                new_name = download_dir / f"sized_{len(kept_images)+1:03d}.jpg"
                img_resized.save(new_name, 'JPEG', quality=95)
                kept_images.append(new_name)
                print(f"[OK] Processed: {img_path.name} ({width}x{height}) -> {target_size[0]}x{target_size[1]}")
                
                # Close image before deleting
                img.close()
                # Delete original
                try:
                    img_path.unlink()
                except:
                    pass
                
                if len(kept_images) >= num_images:
                    break
            else:
                print(f"[SKIP] {img_path.name} (aspect ratio {aspect_ratio:.2f} too different from {target_aspect:.2f})")
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
    
    # Rename to final names
    print("\n3. Finalizing names...")
    for i, img_path in enumerate(kept_images, 1):
        final_name = download_dir / f"image_{i:03d}.jpg"
        img_path.rename(final_name)
        print(f"Renamed to: {final_name.name}")
    
    # Clean up any remaining unnamed files
    for f in download_dir.glob("0*.jpg"):
        f.unlink()
    for f in download_dir.glob("0*.png"):
        f.unlink()
    
    print("\n" + "=" * 50)
    print(f"DOWNLOAD COMPLETE!")
    print(f"Total images saved: {len(kept_images)}")
    print(f"All images resized to: {target_size[0]}x{target_size[1]}")
    print(f"Location: {download_dir.absolute()}")
    print("=" * 50)
    
    return len(kept_images)

def main():
    """
    Main function with examples
    """
    print("IMAGE DOWNLOADER WITH SIZE STANDARDIZATION")
    print("=" * 50)
    
    # Check if Pillow is installed
    try:
        from PIL import Image
    except ImportError:
        print("Installing Pillow for image processing...")
        os.system("pip install Pillow")
        from PIL import Image
    
    # Example downloads
    searches = [
        ("Micah Parsons Cowboys game action", "micah_sized", 15),
        ("Jerry Jones Cowboys owner", "jerry_sized", 10),
        ("Jerry Jones Micah Parsons together", "jerry_micah_sized", 10)
    ]
    
    print("\nChoose what to download:")
    print("1. Micah Parsons (15 images)")
    print("2. Jerry Jones (10 images)")
    print("3. Jerry & Micah together (10 images)")
    print("4. Custom search")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == "1":
        download_images_with_size(searches[0][0], searches[0][1], searches[0][2])
    elif choice == "2":
        download_images_with_size(searches[1][0], searches[1][1], searches[1][2])
    elif choice == "3":
        download_images_with_size(searches[2][0], searches[2][1], searches[2][2])
    elif choice == "4":
        keyword = input("Enter search term: ")
        folder = input("Enter folder name: ")
        num = int(input("Number of images: "))
        download_images_with_size(keyword, folder, num)
    else:
        # Default to Micah
        download_images_with_size(searches[0][0], searches[0][1], searches[0][2])

if __name__ == "__main__":
    # Run without interaction for quick use
    # Just downloads Micah Parsons images with consistent sizing
    download_images_with_size(
        "Micah Parsons Cowboys football game",
        "micah_parsons_sized",
        num_images=30,
        target_size=(1280, 720)  # HD 16:9 aspect ratio
    )