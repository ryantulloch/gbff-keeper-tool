/**
 * Timer Module - Handles deadline countdown timer
 */

let timerInterval = null;

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
            window.initiateCountdown();
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

// Export functions
window.startTimer = startTimer;
window.updateTimer = updateTimer;

// Export interval management
window.getTimerInterval = function() { return timerInterval; };
window.clearTimerInterval = function() { 
    if (timerInterval) clearInterval(timerInterval); 
    timerInterval = null;
};