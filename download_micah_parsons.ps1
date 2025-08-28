# PowerShell Script to Download 30 Micah Parsons Images
# Uses Bing Image Search

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MICAH PARSONS IMAGE DOWNLOADER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Create download folder
$downloadPath = "$PWD\micah_parsons_images"
if (!(Test-Path $downloadPath)) {
    New-Item -ItemType Directory -Path $downloadPath | Out-Null
    Write-Host "Created folder: $downloadPath" -ForegroundColor Green
}

Write-Host "`nDownloading 30 images of Micah Parsons..." -ForegroundColor Yellow

# Search query
$searchQuery = "Micah Parsons Dallas Cowboys jersey"
$encodedQuery = $searchQuery -replace ' ', '+'

# Bing image search URL  
$searchUrl = "https://www.bing.com/images/search?q=$encodedQuery&count=35"

# Headers to mimic browser
$headers = @{
    "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

try {
    # Get search results page
    Write-Host "Fetching image URLs from Bing..." -ForegroundColor Cyan
    $response = Invoke-WebRequest -Uri $searchUrl -Headers $headers -UseBasicParsing
    
    # Extract image URLs using regex
    $pattern = 'murl":"(https?://[^"]+)"'
    $matches = [regex]::Matches($response.Content, $pattern)
    
    if ($matches.Count -eq 0) {
        # Alternative pattern
        $pattern = 'src="(https?://[^"]+\.jpg[^"]*)"'
        $matches = [regex]::Matches($response.Content, $pattern)
    }
    
    $imageUrls = @()
    foreach ($match in $matches) {
        $imageUrls += $match.Groups[1].Value
    }
    
    # Limit to 30 images
    $imageUrls = $imageUrls | Select-Object -First 30
    
    if ($imageUrls.Count -eq 0) {
        Write-Host "No images found. Opening browser for manual download..." -ForegroundColor Red
        Start-Process "https://www.bing.com/images/search?q=Micah+Parsons+Dallas+Cowboys+jersey"
        Write-Host "Please manually save images to: $downloadPath" -ForegroundColor Yellow
        exit
    }
    
    Write-Host "Found $($imageUrls.Count) image URLs" -ForegroundColor Green
    
    # Download each image
    $downloaded = 0
    $failed = 0
    
    for ($i = 0; $i -lt $imageUrls.Count; $i++) {
        $url = $imageUrls[$i]
        $filename = "micah_parsons_$('{0:D3}' -f ($i+1)).jpg"
        $filepath = Join-Path $downloadPath $filename
        
        Write-Host "Downloading image $($i+1)/30: " -NoNewline
        
        try {
            Invoke-WebRequest -Uri $url -OutFile $filepath -Headers $headers -UseBasicParsing
            Write-Host "OK - $filename" -ForegroundColor Green
            $downloaded++
        }
        catch {
            Write-Host "FAILED" -ForegroundColor Red
            $failed++
        }
        
        # Small delay to be respectful
        Start-Sleep -Milliseconds 500
    }
    
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "Download Complete!" -ForegroundColor Green
    Write-Host "Successfully downloaded: $downloaded images" -ForegroundColor Green
    if ($failed -gt 0) {
        Write-Host "Failed: $failed images" -ForegroundColor Red
    }
    Write-Host "Saved to: $downloadPath" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    
}
catch {
    Write-Host "`nError occurred. Opening browser for manual download..." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Fallback: Open browser
    Start-Process "https://www.bing.com/images/search?q=Micah+Parsons+Dallas+Cowboys+jersey"
    Write-Host "`nBrowser opened. Please manually save 30 images to:" -ForegroundColor Yellow
    Write-Host "$downloadPath" -ForegroundColor Cyan
}

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")