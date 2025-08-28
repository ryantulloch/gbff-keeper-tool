/**
 * Countdown Test Module - Safe test mode that doesn't reveal teams
 * This allows testing the countdown overlay animation without touching real data
 */

// Test mode state management
let isTestMode = false;

/**
 * Get test mode status
 */
function getIsTestMode() {
    return isTestMode;
}

/**
 * Set test mode status
 */
function setIsTestMode(value) {
    isTestMode = !!value;
    console.log(isTestMode ? '🧪 TEST MODE ENABLED' : '✅ TEST MODE DISABLED');
}

/**
 * TEST FUNCTION: Trigger countdown manually for styling and testing
 * This is for development/testing purposes only - NO DATA REVEALED
 */
function testCountdown() {
    console.log('⚠️ TEST MODE: Manually triggering countdown for testing purposes');
    
    // Check if countdown is already active
    if (window.getIsCountdownActive() || window.getIsAutoRevealing()) {
        window.showNotification('⚠️ Countdown already in progress!');
        return;
    }
    
    // Set test mode flag to prevent actual reveal
    setIsTestMode(true);
    
    // Show warning notification
    window.showNotification('🧪 TEST MODE: Countdown overlay only - no teams will be revealed');
    
    // Wait 2 seconds to let user prepare
    setTimeout(() => {
        // Set a fake countdown start time
        const testStartTime = Date.now();
        window.setCountdownStartTime(testStartTime);
        
        // Log test mode info
        console.log('🧪 TEST COUNTDOWN INITIATED');
        console.log('Start time:', new Date(testStartTime));
        console.log('Duration:', window.CONFIG.COUNTDOWN_DURATION, 'seconds');
        console.log('🔒 SAFE MODE: No actual reveal will occur - testing overlay only');
        
        // Start the countdown directly
        window.startCountdown();
        
        // Show another notification
        window.showNotification('🧪 Test countdown started - overlay animation only');
    }, 2000);
}

/**
 * Complete test countdown without revealing any data
 */
function completeTestCountdown() {
    console.log('🧪 TEST MODE: Countdown completed - cleaning up without revealing data');
    
    // Hide overlay immediately
    const overlay = document.getElementById('countdownOverlay');
    overlay.classList.add('fading-out');
    
    setTimeout(() => {
        overlay.classList.remove('active', 'fading-out');
        document.getElementById('autoRevealNotice').style.display = 'none';
        document.getElementById('timerDisplay').style.display = 'block';
        
        // Reset states
        window.setIsCountdownActive(false);
        window.setIsAutoRevealing(false);
        setIsTestMode(false);
        window.setCountdownStartTime(null);
        
        // Clear intervals
        window.clearCountdownInterval();
        
        // Reset page title
        document.title = 'GBFF Keepers';
        
        // Show completion notification
        window.showNotification('🧪 Test countdown completed successfully! No data was revealed.');
        
    }, 150);
}

/**
 * Test countdown with commissioner authentication
 */
function testCountdownWithAuth() {
    // Check commissioner password
    const password = (document.getElementById('commissionerPassword') || {}).value || '';
    if (!password) {
        alert('Enter the commissioner password to access the test countdown.');
        return;
    }
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password! Only the commissioner can run test countdowns.');
        return;
    }
    
    // Password is correct, run the test countdown
    console.log('✅ Commissioner authenticated - running test countdown');
    testCountdown();
}

// Export functions
window.getIsTestMode = getIsTestMode;
window.setIsTestMode = setIsTestMode;
window.testCountdown = testCountdown;
window.testCountdownWithAuth = testCountdownWithAuth;
window.completeTestCountdown = completeTestCountdown;