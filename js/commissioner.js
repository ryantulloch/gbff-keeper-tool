/**
 * Commissioner Module - Administrative functions
 */

/**
 * Set the deadline (commissioner only)
 */
function setDeadline() {
    const input = document.getElementById('deadlineInput').value;

    if (!input) {
        alert('Please select a deadline date and time');
        return;
    }

    // Use unified commissioner password input
    const password = (document.getElementById('commissionerPassword') || {}).value || '';
    if (!password) {
        alert('Enter the commissioner password in the Commissioner Controls section.');
        return;
    }
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password! Only the commissioner can set deadlines.');
        return;
    }

    const newDeadline = new Date(input).getTime();

    // Clear any old countdown data when setting new deadline
    Promise.all([
        window.getDb().ref('deadline').set(newDeadline),
        window.getDb().ref('countdownStartTime').remove()
    ]).then(() => {
        alert('✅ Deadline set! All users will see this deadline.');

        // Reset countdown states
        window.setIsCountdownActive(false);
        window.setIsAutoRevealing(false);
        window.setCountdownStartTime(null);
        document.getElementById('countdownOverlay').classList.remove('active');
        document.getElementById('autoRevealNotice').style.display = 'none';
    }).catch((error) => {
        alert('Error setting deadline: ' + error.message);
    });
}

/**
 * Reset everything (commissioner only)
 */
function resetEverything() {
    // Use unified commissioner password input
    const password = (document.getElementById('commissionerPassword') || {}).value || '';
    if (!password) {
        alert('Enter the commissioner password in the Commissioner Controls section.');
        return;
    }
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password! Only the commissioner can reset.');
        return;
    }
    
    if (confirm('🚨 Are you sure you want to RESET EVERYTHING? This will clear all submissions, deadlines, and countdowns!')) {
        Promise.all([
            window.getDb().ref('deadline').remove(),
            window.getDb().ref('countdownStartTime').remove(),
            window.getDb().ref('submissions').remove()
        ]).then(() => {
            alert('✅ Everything reset! Fresh start ready.');
            
            // Reset local state
            window.setSubmissions({});
            window.setDeadline(null);
            window.setCountdownStartTime(null);
            window.setIsCountdownActive(false);
            window.setIsAutoRevealing(false);
            
            // Clear any running intervals
            window.clearTimerInterval();
            window.clearCountdownInterval();
            
            // Reset UI completely
            document.getElementById('deadlineInput').value = window.CONFIG.DEFAULT_DEADLINE;
            document.getElementById('timerDisplay').textContent = 'No deadline set';
            document.getElementById('timerDisplay').className = 'timer';
            document.getElementById('timerDisplay').style.display = 'block';
            document.getElementById('phaseIndicator').textContent = 'Submission Phase';
            document.getElementById('phaseIndicator').className = 'phase-indicator phase-submission';
            document.getElementById('countdownOverlay').classList.remove('active');
            document.getElementById('autoRevealNotice').style.display = 'none';
            document.getElementById('submitButton').disabled = false;
            window.updateDisplay();
        }).catch((error) => {
            alert('Error resetting: ' + error.message);
        });
    }
}

/**
 * Force reveal all submissions (commissioner only)
 */
function forceReveal() {
    const password = document.getElementById('commissionerPassword').value;
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password!');
        return;
    }
    
    // Force countdown to start immediately
    window.initiateCountdown();
}

/**
 * Clear all submissions (commissioner only)
 */
function clearAllSubmissions() {
    const password = document.getElementById('commissionerPassword').value;
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password!');
        return;
    }
    
    if (confirm('Are you sure you want to clear ALL submissions?')) {
        window.getDb().ref('submissions').remove().then(() => {
            alert('✅ All submissions cleared');
            window.setSubmissions({});
            window.updateDisplay();
        });
    }
}

/**
 * Export submissions to JSON (commissioner only)
 */
function exportSubmissions() {
    const password = document.getElementById('commissionerPassword').value;
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password!');
        return;
    }
    
    const dataStr = JSON.stringify(window.getSubmissions(), null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `keeper-submissions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

// Make functions globally accessible
window.setDeadline = setDeadline;
window.resetEverything = resetEverything;
window.forceReveal = forceReveal;
window.clearAllSubmissions = clearAllSubmissions;
window.exportSubmissions = exportSubmissions;
// testCountdownWithAuth is now handled by countdown-test.js module