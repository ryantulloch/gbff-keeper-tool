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
    if (typeof window.testCountdown === 'function') {
        window.testCountdown();
    } else {
        alert('Test countdown function not available. Ensure countdown.js is loaded.');
    }
}

/**
 * Delete Team lovetrain specifically (commissioner only)
 */
function deleteTeamLovetrain() {
    const password = (document.getElementById('commissionerPassword') || {}).value || '';
    if (!password) {
        alert('Enter the commissioner password first.');
        return;
    }
    if (password !== window.CONFIG.COMMISSIONER_PASSWORD) {
        alert('❌ Invalid commissioner password!');
        return;
    }
    
    if (!confirm('Delete "Team lovetrain" from the database?')) {
        return;
    }
    
    const submissions = window.getSubmissions();
    console.log('Looking for Team lovetrain in:', Object.keys(submissions));
    
    // Try different possible key formats
    const possibleKeys = [
        'Team lovetrain',
        'Team_lovetrain',
        'team-lovetrain',
        'team_lovetrain',
        'teamlovetrain'
    ];
    
    let foundKey = null;
    for (const key of possibleKeys) {
        if (submissions[key]) {
            foundKey = key;
            break;
        }
    }
    
    // Also search by partial match
    if (!foundKey) {
        foundKey = Object.keys(submissions).find(key =>
            key.toLowerCase().includes('lovetrain')
        );
    }
    
    if (!foundKey) {
        alert('Team lovetrain not found in database. Available teams: ' + Object.keys(submissions).join(', '));
        return;
    }
    
    // Delete from Firebase
    window.getDb().ref('submissions/' + foundKey).remove().then(() => {
        alert('✅ Team lovetrain deleted successfully! (Key: ' + foundKey + ')');
        
        // Update local cache
        const updatedSubmissions = { ...window.getSubmissions() };
        delete updatedSubmissions[foundKey];
        window.setSubmissions(updatedSubmissions);
        
        if (typeof window.updateDisplay === 'function') {
            window.updateDisplay();
        }
    }).catch((error) => {
        alert('❌ Error deleting Team lovetrain: ' + error.message);
    });
}

// Make functions globally accessible
window.setDeadline = setDeadline;
window.resetEverything = resetEverything;
window.forceReveal = forceReveal;
window.clearAllSubmissions = clearAllSubmissions;
window.exportSubmissions = exportSubmissions;
window.testCountdownWithAuth = testCountdownWithAuth;