/**
 * Encryption Module - XOR cipher utilities
 * Handles encryption, decryption, and hashing
 */

/**
 * Encrypt text using XOR cipher with password
 */
function encrypt(text, password) {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
        encrypted += String.fromCharCode(text.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return btoa(encrypted);
}

/**
 * Decrypt text using XOR cipher with password
 */
function decrypt(encrypted, password) {
    try {
        let decoded = atob(encrypted);
        let decrypted = '';
        for (let i = 0; i < decoded.length; i++) {
            decrypted += String.fromCharCode(decoded.charCodeAt(i) ^ password.charCodeAt(i % password.length));
        }
        return decrypted;
    } catch (e) {
        return null;
    }
}

/**
 * Generate hash for integrity verification
 */
function hash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash) + text.charCodeAt(i);
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

// Make functions globally accessible
window.encrypt = encrypt;
window.decrypt = decrypt;
window.hash = hash;