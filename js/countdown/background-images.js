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
    console.log('🎊 TEST: showMemeAt25Seconds() called');
    
    if (!imageContainer) {
        console.error('❌ Image container not found!');
        imageContainer = document.querySelector('.background-image-container');
        if (!imageContainer) {
            console.error('❌ Could not find .background-image-container in DOM');
            return;
        }
        console.log('✅ Found image container on retry');
    }
    
    console.log('🖼️ Creating test image element...');
    
    // Create and show the test image
    testImageElement = document.createElement('img');
    testImageElement.className = 'background-image active meme-display';
    testImageElement.src = `images/${TEST_IMAGE}`;
    testImageElement.alt = '';
    
    // Add error handling for image loading
    testImageElement.onload = () => {
        console.log('✅ Test image loaded successfully:', testImageElement.src);
        console.log('📐 Image dimensions:', testImageElement.naturalWidth, 'x', testImageElement.naturalHeight);
    };
    
    testImageElement.onerror = () => {
        console.error('❌ Failed to load test image:', testImageElement.src);
    };
    
    // Temporarily increase parent container opacity for debugging
    const parentContainer = document.querySelector('.countdown-background-images');
    if (parentContainer) {
        console.log('🔧 Temporarily increasing parent container opacity for debugging');
        parentContainer.style.opacity = '0.4'; // Perfect visibility for testing
    }
    
    imageContainer.appendChild(testImageElement);
    console.log('✅ Test image added to DOM');
    console.log('🎨 Applied CSS classes:', testImageElement.className);
    
    // Remove after exactly 1 second
    setTimeout(() => {
        if (testImageElement) {
            testImageElement.remove();
            testImageElement = null;
            console.log('✅ Test meme removed after 1 second');
            
            // Reset parent container opacity
            if (parentContainer) {
                parentContainer.style.opacity = '0.06';
                console.log('🔧 Reset parent container opacity to 0.06');
            }
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