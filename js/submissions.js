/**
 * Submissions Module - Handles form submission and reveal logic
 */

/**
 * Submit keepers to Firebase
 */
function submitKeepers(event) {
    // Prevent form submission if called from form
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    if (!window.getFirebaseConnected()) {
        alert('Not connected to Firebase! Please set up connection first.');
        return;
    }

    const teamName = document.getElementById('teamName').value.trim();
    
    // Get all keeper inputs - looking for inputs with name="keeper"
    const keeperInputs = document.querySelectorAll('input[name="keeper"]');
    const keepers = [];
    
    // Collect non-empty keeper values
    keeperInputs.forEach(input => {
        const value = input.value.trim();
        if (value) {
            keepers.push(value);
        }
    });
    
    // Join keepers with newlines for backward compatibility with existing data format
    const keepersList = keepers.join('\n');
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Create or use message div for feedback
    let messageDiv = document.getElementById('submitMessage');
    if (!messageDiv) {
        // Create message div if it doesn't exist
        messageDiv = document.createElement('div');
        messageDiv.id = 'submitMessage';
        const form = document.getElementById('keeperForm');
        form.insertBefore(messageDiv, form.firstChild);
    }

    // Validation - no minimum keepers, allow 0 if user wants
    if (!teamName || !password) {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Please fill in team name and password</div>';
        return;
    }
    
    // Check max keepers
    if (keepers.length > window.CONFIG.MAX_KEEPERS) {
        messageDiv.innerHTML = `<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Maximum ${window.CONFIG.MAX_KEEPERS} keepers allowed</div>`;
        return;
    }

    if (password !== confirmPassword) {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Passwords do not match</div>';
        return;
    }

    if (password.length < 4) {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Password must be at least 4 characters</div>';
        return;
    }

    // Check if team already submitted
    const teamKey = teamName.replace(/[.$#\[\]\/]/g, '_');
    const submissions = window.getSubmissions();
    if (submissions[teamKey]) {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">This team has already submitted</div>';
        return;
    }

    // Check deadline
    if (window.getDeadline() && Date.now() > window.getDeadline()) {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Deadline has passed - submissions are locked</div>';
        return;
    }

    // Create submission with encrypted password for auto-reveal
    const submission = {
        teamName: teamName,
        encryptedKeepers: window.encrypt(keepersList, password),
        encryptedPassword: window.encrypt(password, window.CONFIG.SYSTEM_KEY), // Store encrypted password for auto-reveal
        hash: window.hash(keepersList + password),
        timestamp: Date.now(),
        revealed: false,
        keepers: null
    };

    // Save to Firebase
    window.getDb().ref('submissions/' + teamKey).set(submission).then(() => {
        // Clear form
        document.getElementById('teamName').value = '';
        // Reset keeper fields to initial default count
        window.initializeKeeperFields();
        document.getElementById('password').value = '';
        document.getElementById('confirmPassword').value = '';

        messageDiv.innerHTML = '<div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">✅ Keepers submitted successfully! Your keepers will be auto-revealed after the deadline + 10 second countdown!</div>';
    }).catch((error) => {
        messageDiv.innerHTML = '<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">Error submitting: ' + error.message + '</div>';
    });
}

/**
 * Manually reveal a submission (requires password)
 */
function revealSubmission(teamKey) {
    const submissions = window.getSubmissions();
    const password = prompt('Enter password for ' + submissions[teamKey].teamName + ':');
    if (!password) return;

    const submission = submissions[teamKey];
    if (!submission) return;

    const decrypted = window.decrypt(submission.encryptedKeepers, password);
    if (!decrypted) {
        alert('Incorrect password!');
        return;
    }

    // Verify hash
    const checkHash = window.hash(decrypted + password);
    if (checkHash !== submission.hash) {
        alert('Password verification failed!');
        return;
    }

    // Update submission with revealed data
    window.getDb().ref('submissions/' + teamKey + '/revealed').set(true);
    window.getDb().ref('submissions/' + teamKey + '/keepers').set(decrypted).then(() => {
        alert('Keepers revealed successfully!');
    }).catch((error) => {
        alert('Error revealing: ' + error.message);
    });
}

/**
 * Execute the auto-reveal of all submissions
 */
function executeAutoReveal() {
    if (window.getIsAutoRevealing()) return;
    window.setIsAutoRevealing(true);
    
    // Immediately hide overlay (fade already started in countdown.js)
    const overlay = document.getElementById('countdownOverlay');
    
    // Remove classes after fade animation completes
    setTimeout(() => {
        overlay.classList.remove('active', 'fading-out');
        document.getElementById('autoRevealNotice').style.display = 'none';
    }, 150); // Match the 0.15s fade-out animation
    
    // Auto-reveal all submissions
    const submissions = window.getSubmissions();
    const unrevealed = Object.entries(submissions).filter(([key, sub]) => !sub.revealed);
    
    let revealPromises = unrevealed.map(([teamKey, submission]) => {
        if (submission.encryptedPassword) {
            // Decrypt the password and then decrypt the keepers
            const decryptedPassword = window.decrypt(submission.encryptedPassword, window.CONFIG.SYSTEM_KEY);
            const decryptedKeepers = window.decrypt(submission.encryptedKeepers, decryptedPassword);
            
            if (decryptedKeepers) {
                // Update Firebase with revealed data
                return Promise.all([
                    window.getDb().ref('submissions/' + teamKey + '/revealed').set(true),
                    window.getDb().ref('submissions/' + teamKey + '/keepers').set(decryptedKeepers)
                ]);
            }
        }
        return Promise.resolve();
    });
    
    Promise.all(revealPromises).then(() => {
        // HIDE ALL UI ELEMENTS EXCEPT SUBMISSIONS
        document.getElementById('instructionsSection').style.display = 'none';
        document.getElementById('statusBar').style.display = 'none';
        document.getElementById('commissionerSection').style.display = 'none';
        document.getElementById('submitTab').style.display = 'none';
        document.getElementById('submitContent').style.display = 'none';
        document.getElementById('syncStatus').style.display = 'none';
        
        // Hide the tabs bar and specific viewTab button
        const tabButtons = document.querySelector('.flex.bg-gradient-to-r.from-slate-50.to-slate-100.border-b.border-slate-200');
        if (tabButtons) tabButtons.style.display = 'none';
        
        // Also hide the viewTab button specifically
        const viewTab = document.getElementById('viewTab');
        if (viewTab) viewTab.style.display = 'none';
        
        // Show only the view tab content
        const viewContent = document.getElementById('viewContent');
        viewContent.classList.remove('hidden');
        viewContent.style.display = 'block';
        
        // Hide search and refresh controls in view tab
        const searchControls = viewContent.querySelector('.mb-4.flex');
        if (searchControls) searchControls.style.display = 'none';
        
        // Update header for Final Results - preserve the beautiful gradient text and effects
        const headerTitle = document.getElementById('headerTitle');
        const headerSubtitle = document.getElementById('headerSubtitle');
        
        // Update title text while preserving the gradient span structure
        if (headerTitle) {
            const titleSpan = headerTitle.querySelector('span');
            if (titleSpan) {
                titleSpan.textContent = 'GBFF Keepers – Final Results';
            } else {
                // Fallback if span doesn't exist for some reason
                headerTitle.innerHTML = `
                    <span class="relative inline-block bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent 
                          after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px]
                          after:bg-gradient-to-r after:from-white/90 after:to-blue-300/40
                          after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out
                          hover:after:scale-x-100">
                        GBFF Keepers – Final Results
                    </span>
                `;
            }
            // Keep original Playfair Display font and styling
        }
        
        // Update subtitle text while preserving styling
        if (headerSubtitle) {
            headerSubtitle.textContent = 'The official keeper selections have been revealed';
            // Keep original Playfair Display font and styling
        }
        
        // Ensure items use standard light theme styles
        const submissionItems = document.querySelectorAll('.submission-item');
        submissionItems.forEach((item) => {
            item.classList.remove('final-reveal');
        });
        
        // Update page title
        document.title = 'GBFF Keepers - Final Results';
        
        // No confetti or audio - keep it clean and fast
    });
}

/**
 * Edit existing submission (requires password)
 */
function editSubmission() {
    const teamName = prompt('Enter your team name to edit submission:');
    if (!teamName) return;
    
    const teamKey = teamName.trim().replace(/[.$#\[\]\/]/g, '_');
    const submissions = window.getSubmissions();
    const submission = submissions[teamKey];
    
    if (!submission) {
        alert('No submission found for this team name');
        return;
    }
    
    const password = prompt('Enter your password:');
    if (!password) return;
    
    // Try to decrypt to verify password
    const decrypted = window.decrypt(submission.encryptedKeepers, password);
    if (!decrypted) {
        alert('Incorrect password!');
        return;
    }
    
    // Load the keepers back into the form
    document.getElementById('teamName').value = submission.teamName;
    const keepers = decrypted.split('\n');
    
    // Clear existing keeper fields and add the right number
    const keepersList = document.getElementById('keepersList');
    keepersList.innerHTML = '';
    window.resetKeeperFieldCount();
    
    // Add fields for each keeper (minimum DEFAULT_KEEPER_COUNT fields)
    const fieldsToAdd = Math.max(keepers.length, window.CONFIG.DEFAULT_KEEPER_COUNT);
    for (let i = 0; i < fieldsToAdd; i++) {
        window.addKeeperField(false); // Don't animate
    }
    
    // Fill in the values
    const keeperInputs = document.querySelectorAll('input[name="keeper"]');
    keepers.forEach((keeper, index) => {
        if (keeperInputs[index]) {
            keeperInputs[index].value = keeper;
        }
    });
    
    // Delete the old submission
    window.getDb().ref('submissions/' + teamKey).remove().then(() => {
        alert('Your submission has been loaded for editing. Make your changes and submit again.');
        window.switchTab('submit');
    });
}

/**
 * Filter submissions based on search input
 */
function filterSubmissions() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const submissionItems = document.querySelectorAll('.submission-item');
    
    submissionItems.forEach(item => {
        const teamName = item.querySelector('.team-name').textContent.toLowerCase();
        if (teamName.includes(searchValue)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Refresh submissions display
 */
function refreshSubmissions() {
    window.updateDisplay();
}

// Make functions globally accessible
window.submitKeepers = submitKeepers;
window.revealSubmission = revealSubmission;
window.executeAutoReveal = executeAutoReveal;
window.editSubmission = editSubmission;
window.filterSubmissions = filterSubmissions;
window.refreshSubmissions = refreshSubmissions;