/**
 * Notifications Module - Handles premium notification system
 */

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

// Export function
window.showNotification = showNotification;