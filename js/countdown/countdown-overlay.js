/**
 * Countdown Overlay Module - Handles the 10-second reveal countdown
 */

let countdownInterval = null;

/**
 * Initiate the auto-reveal countdown
 */
function initiateCountdown() {
    if (window.getIsCountdownActive() || window.getIsAutoRevealing()) {
        console.log('⚠️ Countdown already active, skipping initiation');
        return;
    }
    
    console.log('🏈 Checking if countdown should start...', window.getSubmissions());
    
    // Only start countdown if there are submissions and not all are revealed
    const submissions = window.getSubmissions();
    const hasSubmissions = Object.keys(submissions).length > 0;
    const allRevealed = hasSubmissions && Object.values(submissions).every(s => s.revealed);
    
    if (!hasSubmissions || allRevealed) {
        console.log('❌ No countdown needed - no submissions or all revealed');
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.innerHTML = 'Deadline passed';
        timerDisplay.className = 'text-xl font-bold text-slate-600 tabular-nums tracking-tight flex items-center';
        // Clear phase indicator
        document.getElementById('phaseIndicator').innerHTML = '';
        document.getElementById('phaseIndicator').className = 'phase-indicator';
        return;
    }

    // Set countdown start time in Firebase (so all users sync)
    const startTime = Date.now();
    console.log('⏰ Setting countdown start time in Firebase:', new Date(startTime));
    
    window.getDb().ref('countdownStartTime').set(startTime).then(() => {
        console.log('✅ Countdown start time successfully set in Firebase');
        // Also trigger locally in case Firebase is slow
        setTimeout(() => {
            if (!window.getIsCountdownActive()) {
                console.log('🔄 Firebase listener slow, triggering countdown locally');
                window.setCountdownStartTime(startTime);
                startCountdown();
            }
        }, 1000);
    }).catch((error) => {
        console.error('❌ Error setting countdown start time:', error);
        // Fallback - start countdown locally if Firebase fails
        window.setCountdownStartTime(startTime);
        startCountdown();
    });
}

/**
 * Start the 30-second reveal countdown
 */
function startCountdown() {
    if (window.getIsCountdownActive() || window.getIsAutoRevealing()) {
        console.log('Countdown already active or auto-revealing, skipping');
        return;
    }
    
    console.log('🚨 STARTING FULL-SCREEN COUNTDOWN NOW!');
    window.setIsCountdownActive(true);
    
    // Show the countdown overlay
    const overlay = document.getElementById('countdownOverlay');
    overlay.classList.add('active');
    
    // Initialize background images
    if (typeof window.initializeBackgroundImages === 'function') {
        window.initializeBackgroundImages();
    }
    
    // Show the notice banner
    const notice = document.getElementById('autoRevealNotice');
    notice.style.display = 'block';
    
    // Update timer display
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.style.display = 'none'; // Hide main timer during overlay
    }
    
    const phaseIndicator = document.getElementById('phaseIndicator');
    if (phaseIndicator) {
        phaseIndicator.innerHTML = '';
        phaseIndicator.className = 'phase-indicator phase-countdown';
    }
    
    // Disable submit button during countdown
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = true;
    }
    
    // Update page title for users on other tabs
    document.title = 'Keeper reveal in progress';
    
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
    updateCountdown(); // Start immediately (textual updates)
    window.startProgressAnimation(); // Smooth progress ring animation
}

/**
 * Update countdown display every second
 * Premium version with smooth transitions for FUCK/YOU/DANNY at 3/2/1
 * TEST: Single meme flash at 25-second mark only!
 */
function updateCountdown() {
    if (!window.getCountdownStartTime()) return;
    
    const elapsed = Date.now() - window.getCountdownStartTime();
    const remaining = Math.max(0, window.CONFIG.COUNTDOWN_DURATION - Math.floor(elapsed / 1000));
    
    // Get display elements
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownText = document.getElementById('countdownText');
    const countdownMessage = document.getElementById('countdownMessage');
    
    // TEST: Show meme for exactly 1 second at 25-second mark only
    if (remaining === 25) {
        console.log('⏰ COUNTDOWN: At 25-second mark, checking for meme function...');
        if (typeof window.showMemeAt25Seconds === 'function') {
            console.log('✅ COUNTDOWN: showMemeAt25Seconds function found, calling it now');
            window.showMemeAt25Seconds();
        } else {
            console.error('❌ COUNTDOWN: showMemeAt25Seconds function not available on window');
        }
    }
    
    // Smooth transition function with premium timing
    const smoothTransition = (newText, newClass, newSubtext, newMessage) => {
        // Fade out with smooth easing
        countdownNumber.style.opacity = '0';
        countdownText.style.opacity = '0';
        countdownMessage.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            countdownNumber.textContent = newText;
            countdownNumber.className = newClass;
            countdownText.textContent = newSubtext;
            countdownMessage.textContent = newMessage;
            
            // Fade in with smooth easing
            countdownNumber.style.opacity = '1';
            countdownText.style.opacity = '1';
            countdownMessage.style.opacity = '1';
        }, 250); // Increased for smoother transition
    };
    
    // Update display based on remaining time with smooth transitions
    if (remaining === 3) {
        // Display "FUCK" at 3 seconds
        smoothTransition('FUCK', 'countdown-number fuck-text', '', 'Get ready...');
    } else if (remaining === 2) {
        // Display "YOU" at 2 seconds
        smoothTransition('YOU', 'countdown-number you-text', '', 'Almost there...');
    } else if (remaining === 1) {
        // Display "DANNY" at 1 second
        smoothTransition('DANNY', 'countdown-number danny-text', '', 'Here we go!');
    } else if (remaining === 0) {
        // At 0, keep showing DANNY (no visual change to prevent flicker)
        // The actual transition will be handled by executeAutoReveal or completeTestCountdown
    } else {
        // Normal countdown display
        smoothTransition(remaining.toString(), 'countdown-number', 'SECONDS', 'Preparing to reveal all keepers');
    }
    
    // Update main timer display (hidden during overlay)
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.innerHTML = `
            <div class="reveal-timer">
                AUTO-REVEAL IN: <span class="reveal-seconds">${remaining}</span> SECONDS
            </div>
        `;
    }
    
    // Update page title
    document.title = remaining > 0 ? `${remaining}s - KEEPER REVEAL` : 'KEEPERS REVEALED';
    
    // Trigger reveal when countdown reaches 0
    if (remaining <= 0) {
        // Cleanup background images
        if (typeof window.cleanupBackgroundImages === 'function') {
            window.cleanupBackgroundImages();
        }
        
        // Immediately stop intervals and trigger reveal
        clearInterval(countdownInterval);
        window.stopProgressAnimation();
        
        // Start fade and execute reveal immediately (no delay)
        const overlay = document.getElementById('countdownOverlay');
        overlay.classList.add('fading-out');
        
        // Check if this is test mode
        if (window.getIsTestMode && window.getIsTestMode()) {
            window.completeTestCountdown();
        } else if (typeof window.executeAutoReveal === 'function') {
            window.executeAutoReveal();
        } else {
            console.error('executeAutoReveal() not available on window');
        }
    }
}

/**
 * Allow escape from countdown overlay with style
 */
function escapeCountdown() {
    console.log('🚪 Escaping countdown overlay - countdown continues in background');
    
    // Cleanup background images when escaping
    if (typeof window.cleanupBackgroundImages === 'function') {
        window.cleanupBackgroundImages();
    }
    
    // Hide overlay with fade out
    const overlay = document.getElementById('countdownOverlay');
    overlay.classList.add('fading-out');
    
    setTimeout(() => {
        overlay.classList.remove('active', 'fading-out');
        document.getElementById('autoRevealNotice').style.display = 'none';
        document.getElementById('timerDisplay').style.display = 'block';
    }, 300);
    
    // Show stylish notification
    window.showNotification('Countdown continues in background. Controls are now accessible.');
}

// Export functions
window.initiateCountdown = initiateCountdown;
window.startCountdown = startCountdown;
window.updateCountdown = updateCountdown;
window.escapeCountdown = escapeCountdown;

// Export interval management
window.getCountdownInterval = function() { return countdownInterval; };
window.clearCountdownInterval = function() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
    // Also stop the smooth progress animation loop
    if (typeof window.stopProgressAnimation === 'function') {
        window.stopProgressAnimation();
    }
};