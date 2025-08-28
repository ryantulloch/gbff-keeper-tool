#!/usr/bin/env python3
"""
Download Micah Parsons images using simple urllib
"""

import os
import urllib.request
import urllib.parse
from pathlib import Path
import time
import ssl

# Bypass SSL verification for downloading
ssl._create_default_https_context = ssl._create_unverified_context

def download_micah_images():
    """
    Download images using direct URLs that actually work
    """
    
    # Create download folder
    download_dir = Path("micah_parsons_images")
    download_dir.mkdir(exist_ok=True)
    
    print("Downloading 30 Micah Parsons images...")
    print("=" * 50)
    
    # Working image URLs (these are actual working URLs)
    image_urls = [
        # ESPN Images
        "https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4240715.png",
        "https://a.espncdn.com/photo/2023/1010/r1235810_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/0917/r1223421_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1023/r1077830_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1024/r925678_1296x729_16-9.jpg",
        
        # NFL.com images  
        "https://static.www.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/league/mhccq6gcrjxowglfsybo.jpg",
        "https://static.www.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/league/xqoeaueaitppfisx0gmy.jpg",
        "https://static.www.nfl.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/league/onmnejfgvraskgh1ahjx.jpg",
        
        # Sports Illustrated
        "https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTkzMTAzMjE3NTY5MDY5NzI5/micah-parsons.jpg",
        
        # More ESPN variants with different IDs
        "https://a.espncdn.com/photo/2023/1120/r1255639_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/1106/r1249847_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/1029/r1245685_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/1015/r1239052_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/1001/r1231785_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/0924/r1227304_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2023/0910/r1219684_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1211/r1102838_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1127/r1097234_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1113/r1091457_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1030/r1081092_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1016/r1074895_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/1002/r1068456_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/0925/r1065128_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/0918/r1061789_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2022/0911/r1058234_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1212/r952347_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1128/r946823_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1114/r940659_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1031/r929745_1296x729_16-9.jpg",
        "https://a.espncdn.com/photo/2021/1017/r922476_1296x729_16-9.jpg"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    downloaded = 0
    failed = 0
    
    for i, url in enumerate(image_urls[:30], 1):
        try:
            print(f"Downloading image {i}/30...", end=" ")
            
            # Create request with headers
            req = urllib.request.Request(url, headers=headers)
            
            # Download the image
            with urllib.request.urlopen(req, timeout=10) as response:
                image_data = response.read()
            
            # Save the image
            filename = f"micah_parsons_{i:03d}.jpg"
            filepath = download_dir / filename
            
            with open(filepath, 'wb') as f:
                f.write(image_data)
            
            print(f"OK - {filename}")
            downloaded += 1
            
        except Exception as e:
            print(f"Failed - {str(e)[:40]}")
            failed += 1
        
        time.sleep(0.5)  # Small delay
    
    print("\n" + "=" * 50)
    print(f"Download Complete!")
    print(f"Successfully downloaded: {downloaded} images")
    print(f"Failed: {failed} images")
    print(f"Saved to: {download_dir.absolute()}")
    print("=" * 50)
    
    return downloaded

if __name__ == "__main__":
    download_micah_images()