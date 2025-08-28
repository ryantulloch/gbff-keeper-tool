/**
 * Countdown Module - Handles timer and countdown functionality
 * Professional countdown — simplified final seconds styling (no gimmick text)
 * 
 * ENHANCED VERSION - Premium Dark Theme with Gold Accents
 */

let timerInterval = null;
let countdownInterval = null;
let progressRafId = null;

/**
 * Start the deadline countdown timer
 */
function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

/**
 * Update the deadline timer display
 */
function updateTimer() {
    const timerDisplay = document.getElementById('timerDisplay');
    const phaseIndicator = document.getElementById('phaseIndicator');
    
    if (!window.getDeadline || !window.getDeadline()) {
        timerDisplay.innerHTML = 'No deadline set';
        timerDisplay.className = 'text-xl font-bold text-slate-500 tabular-nums tracking-tight flex items-center';
        return;
    }

    const now = Date.now();
    const diff = window.getDeadline() - now;

    if (diff <= 0 && !window.getIsCountdownActive() && !window.getIsAutoRevealing()) {
        // Only auto-start countdown if deadline just passed (within 24 hours)
        const timeSinceExpiry = Math.abs(diff);
        if (timeSinceExpiry <= window.CONFIG.EXPIRY_AUTO_START_WINDOW) {
            console.log('🏈 Deadline recently passed, initiating countdown...');
            initiateCountdown();
        } else {
            // Deadline passed too long ago
            timerDisplay.innerHTML = 'Deadline Expired';
            timerDisplay.className = 'text-xl font-bold text-red-600 flex items-center';
            phaseIndicator.innerHTML = '';
            phaseIndicator.className = 'phase-indicator';
            document.getElementById('submitButton').disabled = true;
        }
    } else if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Professional countdown display - always show seconds for live countdown
        let countdownHTML = '';
        
        if (days > 0) {
            countdownHTML = `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
        } else {
            // For less than a day, show HH:MM:SS format
            countdownHTML = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        timerDisplay.innerHTML = countdownHTML;
        
        // Apply color classes based on urgency - clean minimal design
        if (diff < 60000) {
            timerDisplay.className = 'text-xl font-bold text-red-600 tabular-nums tracking-tight animate-pulse flex items-center';
        } else if (diff < 300000) {
            timerDisplay.className = 'text-xl font-bold text-orange-600 tabular-nums tracking-tight flex items-center';
        } else {
            timerDisplay.className = 'text-xl font-bold text-slate-800 tabular-nums tracking-tight flex items-center';
        }
        
        // Clear phase indicator - no redundant text
        phaseIndicator.innerHTML = '';
        phaseIndicator.className = 'phase-indicator';
        document.getElementById('submitButton').disabled = false;
    }
}

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
 * Start the 10-second reveal countdown
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
    startProgressAnimation(); // Smooth progress ring animation
}

/**
 * Update countdown display every second
 * Premium version with smooth transitions for FUCK/YOU/DANNY at 3/2/1
 */
function updateCountdown() {
    if (!window.getCountdownStartTime()) return;
    
    const elapsed = Date.now() - window.getCountdownStartTime();
    const remaining = Math.max(0, window.CONFIG.COUNTDOWN_DURATION - Math.floor(elapsed / 1000));
    
    // Get display elements
    const countdownNumber = document.getElementById('countdownNumber');
    const countdownText = document.getElementById('countdownText');
    const countdownMessage = document.getElementById('countdownMessage');
    const countdownProgress = document.getElementById('countdownProgress');
    
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
        // The actual transition will be handled by executeAutoReveal
    } else {
        // Normal countdown display
        smoothTransition(remaining.toString(), 'countdown-number', 'SECONDS', 'Preparing to reveal all keepers');
    }
    
    /* Smooth progress ring handled by requestAnimationFrame in startProgressAnimation() */
    
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
        // Immediately stop intervals and trigger reveal
        clearInterval(countdownInterval);
        stopProgressAnimation();
        
        // Start fade and execute reveal immediately (no delay)
        const overlay = document.getElementById('countdownOverlay');
        overlay.classList.add('fading-out');
        
        if (typeof window.executeAutoReveal === 'function') {
            window.executeAutoReveal();
        } else {
            console.error('executeAutoReveal() not available on window');
        }
    }
}

// ProgressBar.js instance
let progressBar = null;

// Smooth progress animation using ProgressBar.js
function startProgressAnimation() {
    if (typeof window.getCountdownStartTime !== 'function') return;

    const totalMs = (window.CONFIG && window.CONFIG.COUNTDOWN_DURATION ? window.CONFIG.COUNTDOWN_DURATION : 10) * 1000;
    const startTime = window.getCountdownStartTime();
    
    // Initialize ProgressBar.js if not already created
    if (!progressBar) {
        const container = document.getElementById('container');
        if (!container) return;
        
        progressBar = new ProgressBar.Circle(container, {
            strokeWidth: 1.5,
            easing: 'easeInOut',
            duration: totalMs,
            color: '#FFEA82',
            trailColor: '#eee',
            trailWidth: 4.5,
            svgStyle: null,
            text: {
                autoStyleContainer: false
            },
            step: function(state, circle) {
                // Reverse the logic: start thin, get thicker as countdown progresses
                const progress = state;
                const newStrokeWidth = 1.5 + (progress * 3.5); // Goes from 1.5 to 5
                circle.trail.setAttribute('stroke-width', 4.5 - (progress * 3.5)); // Goes from 4.5 to 1
                circle.path.setAttribute('stroke-width', newStrokeWidth);
                circle.setText('');
            }
        });
        
        // Style the progress bar container
        progressBar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
        progressBar.text.style.fontSize = '2rem';
    }
    
    // Start the animation from 1.0 to 0.0 (countdown)
    progressBar.set(1.0);
    progressBar.animate(0.0, {
        duration: totalMs,
        easing: 'linear'
    });

    // Handle animation completion
    const checkComplete = () => {
        const now = Date.now();
        const elapsedMs = now - startTime;
        
        if (elapsedMs >= totalMs) {
            progressRafId = null;
        } else {
            progressRafId = requestAnimationFrame(checkComplete);
        }
    };
    
    if (progressRafId) cancelAnimationFrame(progressRafId);
    progressRafId = requestAnimationFrame(checkComplete);
}

function stopProgressAnimation() {
    if (progressRafId) {
        cancelAnimationFrame(progressRafId);
        progressRafId = null;
    }
    
    if (progressBar) {
        progressBar.stop();
        progressBar.destroy();
        progressBar = null;
    }
}


/**
 * Allow escape from countdown overlay with style
 */
function escapeCountdown() {
    console.log('🚪 Escaping countdown overlay - countdown continues in background');
    
    // Hide overlay with fade out
    const overlay = document.getElementById('countdownOverlay');
    overlay.classList.add('fading-out');
    
    setTimeout(() => {
        overlay.classList.remove('active', 'fading-out');
        document.getElementById('autoRevealNotice').style.display = 'none';
        document.getElementById('timerDisplay').style.display = 'block';
    }, 300);
    
    // Show stylish notification
    showNotification('Countdown continues in background. Controls are now accessible.');
}

/**
 * Show a premium notification
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'premium-notification';
    notification.innerHTML = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* Make functions globally accessible */
window.startTimer = startTimer;
window.updateTimer = updateTimer;
window.initiateCountdown = initiateCountdown;
window.startCountdown = startCountdown;
window.updateCountdown = updateCountdown;
window.escapeCountdown = escapeCountdown;
window.showNotification = showNotification;
window.startProgressAnimation = startProgressAnimation;
window.stopProgressAnimation = stopProgressAnimation;
 // executeAutoReveal is defined and exposed by submissions.js

// Store interval references globally for cleanup
window.getTimerInterval = function() { return timerInterval; };
window.getCountdownInterval = function() { return countdownInterval; };
window.clearTimerInterval = function() { 
    if (timerInterval) clearInterval(timerInterval); 
    timerInterval = null;
};
window.clearCountdownInterval = function() {
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = null;
    // Also stop the smooth progress animation loop
    if (typeof stopProgressAnimation === 'function') {
        stopProgressAnimation();
    } else if (window.cancelAnimationFrame && progressRafId) {
        cancelAnimationFrame(progressRafId);
        progressRafId = null;
    }
};

/**
 * TEST FUNCTION: Trigger countdown manually for styling and testing
 * This is for development/testing purposes only
 */
function testCountdown() {
    console.log('⚠️ TEST MODE: Manually triggering countdown for testing purposes');
    
    // Check if countdown is already active
    if (window.getIsCountdownActive() || window.getIsAutoRevealing()) {
        showNotification('⚠️ Countdown already in progress!');
        return;
    }
    
    // Show warning notification
    showNotification('Test mode: starting countdown in 2 seconds...');
    
    // Wait 2 seconds to let user prepare
    setTimeout(() => {
        // Set a fake countdown start time
        const testStartTime = Date.now();
        window.setCountdownStartTime(testStartTime);
        
        // Log test mode info
        console.log('🧪 TEST COUNTDOWN INITIATED');
        console.log('Start time:', new Date(testStartTime));
        console.log('Duration:', window.CONFIG.COUNTDOWN_DURATION, 'seconds');
        console.log('Note: This is test mode - no actual reveal will occur');
        
        // Start the countdown directly
        startCountdown();
        
        // Show another notification
        showNotification('Test countdown started.');
    }, 2000);
}

// Make test function globally accessible
window.testCountdown = testCountdown;