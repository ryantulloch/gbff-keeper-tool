/**
 * Firebase Manager Module - Handles all Firebase operations
 * Manages connection, listeners, and data operations
 */

// Global variables for Firebase
let db = null;
let submissions = {};
let deadline = null;
let firebaseConnected = false;
let countdownStartTime = null;
let isCountdownActive = false;
let isAutoRevealing = false;

/**
 * Connect to Firebase and initialize database
 */
function connectFirebase() {
    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(window.CONFIG.firebaseConfig);
        }
        
        db = firebase.database();
        
        // Monitor connection status
        db.ref('.info/connected').on('value', (snapshot) => {
            const connected = snapshot.val();
            const status = document.getElementById('syncStatus');
            if (connected) {
                status.className = 'sync-status connected';
                status.innerHTML = '<span>Live Sync Active</span>';
                firebaseConnected = true;
                
                // Start listening for data
                initializeListeners();
            } else {
                status.className = 'sync-status disconnected';
                status.innerHTML = '<span>Offline</span>';
            }
        });
        
    } catch (error) {
        console.error('Firebase error:', error);
        alert('Firebase connection failed: ' + error.message);
    }
}

/**
 * Initialize Firebase data listeners
 */
function initializeListeners() {
    // Listen for deadline changes
    db.ref('deadline').on('value', (snapshot) => {
        deadline = snapshot.val();
        if (deadline) {
            const date = new Date(deadline);
            const localDateTime = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            document.getElementById('deadlineInput').value = localDateTime;
            startTimer();
        } else {
            // No deadline in Firebase, use default
            document.getElementById('deadlineInput').value = window.CONFIG.DEFAULT_DEADLINE;
        }
    });

    // Listen for submission changes
    db.ref('submissions').on('value', (snapshot) => {
        submissions = snapshot.val() || {};
        updateDisplay();
    });

    // Listen for countdown start time
    db.ref('countdownStartTime').on('value', (snapshot) => {
        const newCountdownStartTime = snapshot.val();
        console.log('Countdown start time from Firebase:', newCountdownStartTime);
        
        if (newCountdownStartTime) {
            const elapsed = Date.now() - newCountdownStartTime;
            console.log('Countdown elapsed time:', elapsed, 'ms');
            
            // Only join countdown if it's recent and still valid
            if (elapsed < window.CONFIG.COUNTDOWN_STALE_THRESHOLD && elapsed >= 0) {
                if (!isCountdownActive && !isAutoRevealing) {
                    countdownStartTime = newCountdownStartTime;
                    console.log('Joining countdown in progress');
                    startCountdown();
                }
            } else if (elapsed >= window.CONFIG.COUNTDOWN_STALE_THRESHOLD) {
                // Countdown is old and should have finished, clean it up
                console.log('Countdown is stale, cleaning up');
                db.ref('countdownStartTime').remove();
                isCountdownActive = false;
                isAutoRevealing = false;
            }
        } else if (newCountdownStartTime !== countdownStartTime) {
            // Countdown was cleared
            console.log('Countdown cleared from Firebase');
            countdownStartTime = null;
            isCountdownActive = false;
            isAutoRevealing = false;
            document.getElementById('countdownOverlay').classList.remove('active');
            document.getElementById('autoRevealNotice').style.display = 'none';
        }
    });
}

// Make variables and functions globally accessible
window.db = db;
window.submissions = submissions;
window.deadline = deadline;
window.firebaseConnected = firebaseConnected;
window.countdownStartTime = countdownStartTime;
window.isCountdownActive = isCountdownActive;
window.isAutoRevealing = isAutoRevealing;
window.connectFirebase = connectFirebase;
window.initializeListeners = initializeListeners;

// Export getters for other modules
window.getDb = function() { return db; };
window.getSubmissions = function() { return submissions; };
window.getDeadline = function() { return deadline; };
window.getFirebaseConnected = function() { return firebaseConnected; };
window.getCountdownStartTime = function() { return countdownStartTime; };
window.getIsCountdownActive = function() { return isCountdownActive; };
window.getIsAutoRevealing = function() { return isAutoRevealing; };

// Export setters for other modules
window.setCountdownStartTime = function(time) { countdownStartTime = time; };
window.setIsCountdownActive = function(active) { isCountdownActive = active; };
window.setIsAutoRevealing = function(revealing) { isAutoRevealing = revealing; };
window.setSubmissions = function(subs) { submissions = subs; };
window.setDeadline = function(dl) { deadline = dl; };