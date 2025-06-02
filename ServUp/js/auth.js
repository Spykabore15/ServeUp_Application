// Authentication and session management module

/**
 * Checks if a user is currently logged in.
 * @returns {object|null} The logged-in user object or null if not logged in.
 */
function getLoggedInUser() {
    const user = localStorage.getItem('loggedInUser');
    return user ? JSON.parse(user) : null;
}

/**
 * Logs out the current user by removing their data from localStorage.
 */
function logoutUser() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html'; // Redirect to login page
}

/**
 * Protects a page by redirecting to login if no user is logged in.
 * Call this at the beginning of scripts for protected pages.
 */
function protectPage() {
    if (!getLoggedInUser()) {
        window.location.href = 'login.html';
    }
}

/**
 * Checks if the logged-in user has one of the specified roles.
 * @param {string[]} allowedRoles - An array of role strings.
 * @returns {boolean} True if the user has an allowed role, false otherwise.
 */
function checkUserRole(allowedRoles) {
    const user = getLoggedInUser();
    if (user && user.role && allowedRoles.includes(user.role)) {
        return true;
    }
    return false;
}

// --- Global Theme Application ---
/**
 * Applies the saved dark mode preference to the body.
 * Reads from localStorage key 'servup_preferences'.
 */
function applyGlobalTheme() {
    try {
        const storedPrefsString = localStorage.getItem('servup_preferences');
        if (storedPrefsString) {
            const storedPrefs = JSON.parse(storedPrefsString);
            if (storedPrefs && typeof storedPrefs.darkMode === 'boolean') {
                if (storedPrefs.darkMode) {
                    document.body.classList.add('dark-mode');
                } else {
                    document.body.classList.remove('dark-mode');
                }
            } else {
                 // If darkMode preference is not explicitly set, default to light (no class)
                document.body.classList.remove('dark-mode');
            }
        } else {
            // If no preferences are stored at all, default to light
            document.body.classList.remove('dark-mode');
        }
    } catch (error) {
        console.error('Error applying global theme:', error);
        // Fallback to light mode on error
        document.body.classList.remove('dark-mode');
    }
}

const ACCESSIBILITY_PREFERENCES_KEY_GLOBAL = 'servup_accessibility_preferences'; // Ensure this key matches settings.js

// Function to apply accessibility settings globally
function applyGlobalAccessibilitySettings() {
    const accessibilitySettings = JSON.parse(localStorage.getItem(ACCESSIBILITY_PREFERENCES_KEY_GLOBAL)) || {};

    if (Object.keys(accessibilitySettings).length === 0) return; // No settings saved

    // Apply Font Size
    document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-xlarge');
    if (accessibilitySettings.fontSize) {
        document.body.classList.add(`font-${accessibilitySettings.fontSize}`);
    } else {
        document.body.classList.add('font-normal'); // Default if not set but object exists
    }

    // Apply Readable Font
    if (accessibilitySettings.readableFont) {
        document.body.classList.add('readable-font');
    } else {
        document.body.classList.remove('readable-font');
    }

    // Apply Highlight Links
    if (accessibilitySettings.highlightLinks) {
        document.body.classList.add('highlight-links');
    } else {
        document.body.classList.remove('highlight-links');
    }

    // Apply High Contrast Mode
    if (accessibilitySettings.highContrastMode) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
}

// Apply theme and accessibility settings as soon as the script loads
applyGlobalTheme(); 
applyGlobalAccessibilitySettings();

// --- Toast Notification Utility ---
/**
 * Displays a toast notification.
 * @param {string} message - The message to display.
 * @param {string} [type='success'] - Type of toast: 'success', 'error', or 'info'.
 * @param {number} [duration=3000] - Duration in milliseconds for the toast to be visible.
 */
function showToast(message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger the show animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); // Small delay to allow CSS transition to catch the class change

    // Hide and remove the toast after specified duration
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the element after the fade out animation completes
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500); // Match this with CSS transition duration for opacity
    }, duration);
}

// Make functions available for import in other scripts if using modules (not strictly necessary for this project setup)
// export { getLoggedInUser, logoutUser, protectPage, checkUserRole }; 