# PowerShell Script to Open Multiple Micah Parsons Image Searches
# Opens browser tabs with different search queries

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MICAH PARSONS IMAGE SEARCH OPENER" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Create download folder
$downloadPath = "$PWD\micah_parsons_images"
if (!(Test-Path $downloadPath)) {
    New-Item -ItemType Directory -Path $downloadPath | Out-Null
    Write-Host "Created folder: $downloadPath" -ForegroundColor Green
}

Write-Host "`nOpening multiple search tabs for Micah Parsons..." -ForegroundColor Yellow
Write-Host "Save about 30 images total to: $downloadPath" -ForegroundColor Cyan

# Different search queries for variety
$searches = @(
    "Micah Parsons Cowboys game",
    "Micah Parsons sack celebration",
    "Micah Parsons Dallas Cowboys",
    "Micah Parsons playing football",
    "Micah Parsons Cowboys tackle",
    "Micah Parsons NFL action"
)

# Open each search in browser
foreach ($search in $searches) {
    $encoded = $search -replace ' ', '+'
    $url = "https://www.bing.com/images/search?q=$encoded"
    
    Write-Host "Opening: $search" -ForegroundColor Green
    Start-Process $url
    
    # Small delay between tabs
    Start-Sleep -Seconds 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "INSTRUCTIONS:" -ForegroundColor Yellow
Write-Host "1. Right-click images and 'Save Image As'" -ForegroundColor White
Write-Host "2. Save to folder: $downloadPath" -ForegroundColor White
Write-Host "3. Save about 5-6 images from each tab (30 total)" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")