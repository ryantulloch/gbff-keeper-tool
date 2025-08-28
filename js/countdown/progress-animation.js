/**
 * Progress Animation Module - Handles smooth circular progress bar for countdown
 */

// ProgressBar.js instance
let progressBar = null;
let progressRafId = null;

/**
 * Smooth progress animation using ProgressBar.js
 */
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

/**
 * Stop progress animation and cleanup
 */
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

// Export functions
window.startProgressAnimation = startProgressAnimation;
window.stopProgressAnimation = stopProgressAnimation;