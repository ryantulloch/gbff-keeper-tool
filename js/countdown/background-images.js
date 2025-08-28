/**
 * Background Images Module - TEST VERSION: Single meme at 25-second mark
 */

let imageContainer = null;
let testImageElement = null;

// Test with just the first image
const TEST_IMAGE = 'IMG_2106.JPG';

/**
 * Initialize background images system - simplified for test
 */
function initializeBackgroundImages() {
    imageContainer = document.querySelector('.background-image-container');
    if (!imageContainer) {
        console.error('Background image container not found');
        return;
    }
    
    console.log('🖼️ Initializing background images system - TEST MODE');
    preloadTestImage();
}

/**
 * Preload the test image
 */
function preloadTestImage() {
    const img = new Image();
    img.onload = () => {
        console.log(`📸 Test image loaded: ${TEST_IMAGE}`);
    };
    img.onerror = () => {
        console.warn(`⚠️ Failed to load test image: ${TEST_IMAGE}`);
    };
    img.src = `images/${TEST_IMAGE}`;
}

/**
 * Show meme for exactly 1 second at 25-second mark
 */
function showMemeAt25Seconds() {
    if (!imageContainer) return;
    
    console.log('🎊 TEST: Showing meme for 1 second at 25-second mark');
    
    // Create and show the test image
    testImageElement = document.createElement('img');
    testImageElement.className = 'background-image active meme-display';
    testImageElement.src = `images/${TEST_IMAGE}`;
    testImageElement.alt = '';
    
    imageContainer.appendChild(testImageElement);
    
    // Remove after exactly 1 second
    setTimeout(() => {
        if (testImageElement) {
            testImageElement.remove();
            testImageElement = null;
            console.log('✅ Test meme removed after 1 second');
        }
    }, 1000);
}

/**
 * Cleanup background images
 */
function cleanupBackgroundImages() {
    if (testImageElement) {
        testImageElement.remove();
        testImageElement = null;
    }
    
    console.log('🧹 Background images cleaned up');
}

// Export functions to global scope
window.initializeBackgroundImages = initializeBackgroundImages;
window.showMemeAt25Seconds = showMemeAt25Seconds;
window.cleanupBackgroundImages = cleanupBackgroundImages;

// Remove unused functions for this test
window.triggerImagePulse = function() {}; // No-op for test
window.cycleToNextImage = function() {}; // No-op for test