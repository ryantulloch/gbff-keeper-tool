/**
 * Background Images Module - Manages faint pulsing meme images during countdown
 */

let currentImageIndex = 0;
let images = [];
let imageContainer = null;
let currentImageElement = null;

// All 26 meme images from the images folder
const IMAGE_FILES = [
    '000cdb61-2f11-4168-a677-3d61d4225565.JPG',
    '3c947ed5-3401-499d-b16a-489052c5c782.jpg',
    '6cd9f21f-f1c0-41f6-a959-ac46efcb442f.JPG',
    '7b990243-1819-485d-9982-ace10a2d9346.jpg',
    '13d34b7f-6b81-4dea-ae63-eea8e0ae02bc.jpg',
    '64f86622-35db-4005-8cc0-e5618dd7c6ad.JPG',
    '302e45fe-5a30-48d2-ba50-6bf3cf06715c.jpg',
    '773B282F-ACA6-43FB-8FDB-CC340B704119.PNG',
    'b2fe89e8-43eb-4853-a8b3-f13cf8d61266.JPG',
    'b4a96d27-9ed8-4c3f-88c2-d135ce4e9937.JPG',
    'bc371136-26f9-4b5d-b902-1024f2b33b80.JPG',
    'c6d1a061-8498-4b7f-a4ba-bc289e7b5b2b.jpg',
    'd416c620-cb91-4bdf-87ab-d2b00fde9597.JPG',
    'da1424f6-297d-42ee-addd-a8fe4879c479.JPG',
    'ddcd72b8-a66d-4e00-a31c-3d8fbcc7c0e5.jpg',
    'de4b6bc8-82b0-41fb-8d5e-0e8f226183b3.JPG',
    'e4bf06bb-85d8-446b-b931-351b31f53748.jpg',
    'ed2dd88f-33d5-4788-a29e-fe1126819f32.JPG',
    'IMG_2106.JPG',
    'IMG_2202.jpg',
    'IMG_2205.jpg',
    'IMG_2213.jpg',
    'IMG_2216.jpg',
    'IMG_2221.jpg',
    'IMG_2223.jpg',
    'IMG_2225.jpg'
];

/**
 * Initialize background images system
 */
function initializeBackgroundImages() {
    imageContainer = document.querySelector('.background-image-container');
    if (!imageContainer) {
        console.error('Background image container not found');
        return;
    }
    
    console.log('🖼️ Initializing background images system with', IMAGE_FILES.length, 'memes');
    preloadImages();
}

/**
 * Preload all images for smooth transitions
 */
function preloadImages() {
    images = [];
    let loadedCount = 0;
    
    IMAGE_FILES.forEach((filename, index) => {
        const img = new Image();
        img.onload = () => {
            loadedCount++;
            console.log(`📸 Loaded image ${loadedCount}/${IMAGE_FILES.length}: ${filename}`);
            
            if (loadedCount === IMAGE_FILES.length) {
                console.log('✅ All meme images preloaded successfully');
                setupInitialImage();
            }
        };
        img.onerror = () => {
            console.warn(`⚠️ Failed to load image: ${filename}`);
            loadedCount++;
            if (loadedCount === IMAGE_FILES.length) {
                setupInitialImage();
            }
        };
        img.src = `images/${filename}`;
        images[index] = img;
    });
}

/**
 * Setup the initial background image
 */
function setupInitialImage() {
    if (images.length === 0) {
        console.warn('No images loaded, skipping background image setup');
        return;
    }
    
    // Start with a random image
    currentImageIndex = Math.floor(Math.random() * images.length);
    showImage(currentImageIndex);
}

/**
 * Display an image by index
 */
function showImage(index) {
    if (!imageContainer || !images[index]) return;
    
    // Remove any existing image
    if (currentImageElement) {
        currentImageElement.remove();
    }
    
    // Create new image element
    currentImageElement = document.createElement('img');
    currentImageElement.className = 'background-image active';
    currentImageElement.src = images[index].src;
    currentImageElement.alt = '';
    
    imageContainer.appendChild(currentImageElement);
    
    console.log(`🎭 Showing meme ${index + 1}/${images.length}: ${IMAGE_FILES[index]}`);
}

/**
 * Trigger pulse animation on current image
 */
function triggerImagePulse() {
    if (!currentImageElement) return;
    
    // Remove any existing pulse animation
    currentImageElement.classList.remove('pulsing');
    
    // Force reflow to restart animation
    currentImageElement.offsetHeight;
    
    // Add pulse animation
    currentImageElement.classList.add('pulsing');
    
    // Remove pulse class after animation completes
    setTimeout(() => {
        if (currentImageElement) {
            currentImageElement.classList.remove('pulsing');
        }
    }, 1000);
}

/**
 * Cycle to next image
 */
function cycleToNextImage() {
    if (images.length === 0) return;
    
    currentImageIndex = (currentImageIndex + 1) % images.length;
    showImage(currentImageIndex);
}

/**
 * Show meme at 25-second mark (replaces countdown number)
 */
function showMemeAt25Seconds() {
    if (!currentImageElement) return;
    
    console.log('🎊 MEME TIME! Showing meme at 25-second mark');
    
    // Hide countdown number and text
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownText = document.getElementById('countdownText');
    
    if (countdownNumber) countdownNumber.style.opacity = '0';
    if (countdownText) countdownText.style.opacity = '0';
    
    // Make current image more visible and animated
    currentImageElement.classList.add('meme-display');
    
    // Return to normal after 2 seconds
    setTimeout(() => {
        if (currentImageElement) {
            currentImageElement.classList.remove('meme-display');
        }
        if (countdownNumber) countdownNumber.style.opacity = '1';
        if (countdownText) countdownText.style.opacity = '1';
    }, 2000);
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
window.triggerImagePulse = triggerImagePulse;
window.cycleToNextImage = cycleToNextImage;
window.showMemeAt25Seconds = showMemeAt25Seconds;
window.cleanupBackgroundImages = cleanupBackgroundImages;