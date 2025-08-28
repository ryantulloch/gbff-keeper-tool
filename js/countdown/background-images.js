/**
 * Background Images Module - 57 Cowboys/Micah/Jerry Images for Countdown Seconds 60-4
 */

console.log('🖼️ BACKGROUND IMAGES VERSION: 2025-01-28-CROSSFADE-FIX (smooth transitions)');

let imageContainer = null;
let currentImageElement = null;

// Complete array of 57 images for countdown seconds 60-4 - CORRECT PATHS
const COUNTDOWN_IMAGES = [
    // Cowboys Memes Square (10 images) - FOUND THE DIRECTORY!
    'cowboys_memes_square/cowboys_meme_002.jpg',
    'cowboys_memes_square/cowboys_meme_003.jpg',
    'cowboys_memes_square/cowboys_meme_006.jpg',
    'cowboys_memes_square/cowboys_meme_010.jpg',
    'cowboys_memes_square/cowboys_meme_013.jpg',
    'cowboys_memes_square/cowboys_meme_014.jpg',
    'cowboys_memes_square/cowboys_meme_015.jpg',
    'cowboys_memes_square/cowboys_meme_017.jpg',
    'cowboys_memes_square/cowboys_meme_018.jpg',
    'cowboys_memes_square/cowboys_meme_019.jpg',
    
    // Micah Solo Square Crop (24 images)
    'micah_solo_square_crop/micah_solo_001.jpg',
    'micah_solo_square_crop/micah_solo_002.jpg',
    'micah_solo_square_crop/micah_solo_003.jpg',
    'micah_solo_square_crop/micah_solo_004.jpg',
    'micah_solo_square_crop/micah_solo_006.jpg',
    'micah_solo_square_crop/micah_solo_008.jpg',
    'micah_solo_square_crop/micah_solo_009.jpg',
    'micah_solo_square_crop/micah_solo_011.jpg',
    'micah_solo_square_crop/micah_solo_012.jpg',
    'micah_solo_square_crop/micah_solo_013.jpg',
    'micah_solo_square_crop/micah_solo_014.jpg',
    'micah_solo_square_crop/micah_solo_015.jpg',
    'micah_solo_square_crop/micah_solo_016.jpg',
    'micah_solo_square_crop/micah_solo_017.jpg',
    'micah_solo_square_crop/micah_solo_018.jpg',
    'micah_solo_square_crop/micah_solo_019.jpg',
    'micah_solo_square_crop/micah_solo_020.jpg',
    'micah_solo_square_crop/micah_solo_023.jpg',
    'micah_solo_square_crop/micah_solo_024.jpg',
    'micah_solo_square_crop/micah_solo_025.jpg',
    'micah_solo_square_crop/micah_solo_026.jpg',
    'micah_solo_square_crop/micah_solo_027.jpg',
    'micah_solo_square_crop/micah_solo_028.jpg',
    'micah_solo_square_crop/micah_solo_029.jpg',
    
    // Micah Jerry Square Crop (8 images)
    'micah_jerry_square_crop/micah_jerry_001.jpg',
    'micah_jerry_square_crop/micah_jerry_002.jpg',
    'micah_jerry_square_crop/micah_jerry_005.jpg',
    'micah_jerry_square_crop/micah_jerry_017.jpg',
    'micah_jerry_square_crop/micah_jerry_018.jpg',
    'micah_jerry_square_crop/micah_jerry_020.jpg',
    'micah_jerry_square_crop/micah_jerry_021.jpg',
    'micah_jerry_square_crop/micah_jerry_022.jpg',
    
    // Cowboys Memes Funny Crop (1 image)
    'cowboys_memes_funny_crop/cowboys_memes_funny_crop_006.jpg',
    
    // Jerry Jones Solo Crop (14 images)
    'jerry_jones_solo_crop/jerry_jones_solo_crop_001.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_002.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_003.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_004.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_006.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_008.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_009.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_010.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_011.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_014.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_015.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_017.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_019.jpg',
    'jerry_jones_solo_crop/jerry_jones_solo_crop_020.jpg'
];

/**
 * Initialize background images system - 57 images total
 */
function initializeBackgroundImages() {
    imageContainer = document.querySelector('.background-image-container');
    if (!imageContainer) {
        console.error('Background image container not found');
        return;
    }
    
    console.log('🖼️ Initializing background images system - 57 IMAGES READY');
    console.log(`📊 Total images loaded: ${COUNTDOWN_IMAGES.length}`);
    preloadImages();
}

/**
 * Preload all countdown images for smooth transitions
 */
function preloadImages() {
    console.log('📸 Preloading all 57 countdown images...');
    let loadedCount = 0;
    
    COUNTDOWN_IMAGES.forEach((imagePath, index) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            if (loadedCount === COUNTDOWN_IMAGES.length) {
                console.log('✅ All 57 countdown images preloaded successfully');
            }
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load image ${index + 1}: ${imagePath}`);
        };
        img.src = imagePath;
    });
}

/**
 * Show image for specific countdown second (seconds 60-4 only)
 * @param {number} remainingSeconds - Countdown seconds remaining (60 to 0)
 */
function showImageAtSecond(remainingSeconds) {
    // DEBUG: Always log what's happening
    console.log(`🖼️ showImageAtSecond() called with remainingSeconds = ${remainingSeconds}`);
    
    // Only show images for seconds 60-4 (NOT during final 3 seconds)
    if (remainingSeconds < 4 || remainingSeconds > 60) {
        console.log(`⏰ COUNTDOWN ${remainingSeconds}s: No image (preserving FUCK/YOU/DANNY text)`);
        return;
    }
    
    // Calculate image index: second 60 = index 0, second 4 = index 56
    const imageIndex = 60 - remainingSeconds;
    
    if (imageIndex < 0 || imageIndex >= COUNTDOWN_IMAGES.length) {
        console.warn(`⚠️ Image index ${imageIndex} out of range for ${COUNTDOWN_IMAGES.length} images`);
        return;
    }
    
    const imagePath = COUNTDOWN_IMAGES[imageIndex];
    console.log(`🖼️ COUNTDOWN ${remainingSeconds}s: Showing image ${imageIndex + 1}/57 - ${imagePath}`);
    
    if (!imageContainer) {
        console.error('❌ Image container not found!');
        imageContainer = document.querySelector('.background-image-container');
        if (!imageContainer) {
            console.error('❌ Could not find .background-image-container in DOM');
            return;
        }
    }
    
    // Create new image element
    const newImageElement = document.createElement('img');
    newImageElement.className = 'background-image'; // Start without 'active' class
    newImageElement.src = imagePath;
    newImageElement.alt = '';
    
    // Add error handling
    newImageElement.onload = () => {
        console.log(`✅ Image ${imageIndex + 1} loaded successfully: ${imagePath}`);
    };
    
    newImageElement.onerror = () => {
        console.error(`❌ Failed to load image ${imageIndex + 1}: ${imagePath}`);
    };
    
    // Add new image to container (overlapping with previous if exists)
    imageContainer.appendChild(newImageElement);
    
    // Trigger fade-in animation after a brief delay (for CSS to register)
    requestAnimationFrame(() => {
        newImageElement.classList.add('active');
        console.log(`✨ Crossfade: Image ${imageIndex + 1} fading in`);
    });
    
    // Handle previous image with crossfade
    if (currentImageElement) {
        const previousImage = currentImageElement;
        const previousIndex = imageIndex > 0 ? imageIndex : 56; // Handle wrap-around
        
        // Start fading out previous image after new one starts fading in
        setTimeout(() => {
            previousImage.classList.remove('active');
            console.log(`✨ Crossfade: Image ${previousIndex} fading out`);
            
            // Remove previous image from DOM after fade-out completes
            setTimeout(() => {
                if (previousImage && previousImage.parentNode) {
                    previousImage.remove();
                    console.log(`✨ Crossfade transition complete for image ${previousIndex}`);
                }
            }, 400); // Match CSS transition duration
        }, 100); // Small overlap for smooth crossfade
    }
    
    // Update current reference
    currentImageElement = newImageElement;
}

/**
 * Cleanup background images
 */
function cleanupBackgroundImages() {
    if (currentImageElement) {
        currentImageElement.remove();
        currentImageElement = null;
    }
    
    console.log('🧹 Background images cleaned up');
}

// Export functions to global scope
window.initializeBackgroundImages = initializeBackgroundImages;
window.showImageAtSecond = showImageAtSecond;
window.cleanupBackgroundImages = cleanupBackgroundImages;