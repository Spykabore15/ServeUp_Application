document.addEventListener('DOMContentLoaded', () => {
    protectPage();
    const loggedInUser = getLoggedInUser();
    if (!loggedInUser) return;

    // DOM Elements
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutButton = document.getElementById('logoutButton');
    
    const preferencesForm = document.getElementById('preferencesForm');
    const restaurantNameInput = document.getElementById('restaurantName');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const prefsMessage = document.getElementById('prefsMessage');

    const changePasswordForm = document.getElementById('changePasswordForm');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const passwordChangeMessage = document.getElementById('passwordChangeMessage');

    const ACCESSIBILITY_PREFERENCES_KEY = 'servup_accessibility_preferences';

    // Initialize Navbar
    if (usernameDisplay) usernameDisplay.textContent = loggedInUser.username;
    if (logoutButton) logoutButton.addEventListener('click', logoutUser);

    // --- Preferences Handling ---
    function loadPreferences() {
        const storedPrefs = JSON.parse(localStorage.getItem('servup_preferences')) || {};
        if (restaurantNameInput) {
            restaurantNameInput.value = storedPrefs.restaurantName || 'ServUp Restaurant';
        }
        if (darkModeToggle) {
            darkModeToggle.checked = storedPrefs.darkMode || false;
            applyDarkMode(darkModeToggle.checked);
        }
    }

    function savePreferences(event) {
        if(event) event.preventDefault();
        const prefs = {
            restaurantName: restaurantNameInput ? restaurantNameInput.value : 'ServUp Restaurant',
            darkMode: darkModeToggle ? darkModeToggle.checked : false
        };
        localStorage.setItem('servup_preferences', JSON.stringify(prefs));
        
        applyDarkMode(prefs.darkMode);

        if (prefsMessage) {
            showToast('Préférences enregistrées avec succès!', 'success');
        }
    }

    function applyDarkMode(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    if (preferencesForm) {
        preferencesForm.addEventListener('submit', savePreferences);
    }
    if (darkModeToggle) {
        // Save preferences immediately when toggle changes for responsiveness
        darkModeToggle.addEventListener('change', () => {
            const prefs = {
                restaurantName: restaurantNameInput ? restaurantNameInput.value : 'ServUp Restaurant',
                darkMode: darkModeToggle.checked
            };
            localStorage.setItem('servup_preferences', JSON.stringify(prefs));
            applyDarkMode(prefs.darkMode);
            // Optionally show a quick confirmation, or rely on the main save button
        });
    }

    // --- Simulated Password Change --- 
    function handleChangePassword(event) {
        event.preventDefault();
        const currentPass = currentPasswordInput.value;
        const newPass = newPasswordInput.value;
        const confirmPass = confirmNewPasswordInput.value;

        passwordChangeMessage.style.display = 'block';

        if (!currentPass || !newPass || !confirmPass) {
            showToast('Veuillez remplir tous les champs.', 'error');
            return;
        }
        if (newPass !== confirmPass) {
            showToast('Les nouveaux mots de passe ne correspondent pas.', 'error');
            return;
        }
        if (newPass.length < 6) { // Simple validation
            showToast('Le nouveau mot de passe doit comporter au moins 6 caractères.', 'error');
            return;
        }

        // Simulation: In a real app, you would verify currentPass against a stored hash
        // and then hash and save the newPass.
        showToast('Mot de passe changé avec succès (simulation)!', 'success');
        changePasswordForm.reset();
    }

    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handleChangePassword);
    }

    // Initial load
    loadPreferences();

    // Function to apply all accessibility settings from an object
    function applyAccessibilitySettings(settings) {
        if (!settings) return;

        // Apply Font Size
        document.body.classList.remove('font-small', 'font-normal', 'font-large', 'font-xlarge');
        if (settings.fontSize) {
            document.body.classList.add(`font-${settings.fontSize}`);
        }

        // Apply Readable Font
        if (settings.readableFont) {
            document.body.classList.add('readable-font');
        } else {
            document.body.classList.remove('readable-font');
        }

        // Apply Highlight Links
        if (settings.highlightLinks) {
            document.body.classList.add('highlight-links');
        } else {
            document.body.classList.remove('highlight-links');
        }

        // Apply High Contrast Mode
        if (settings.highContrastMode) {
            document.body.classList.add('high-contrast');
            // Potentially disable dark mode if high contrast is on, or define combined styles
            // For now, high contrast will take precedence if its styles are more specific or use !important
        } else {
            document.body.classList.remove('high-contrast');
        }
    }

    // Function to load all preferences, including accessibility
    function loadAllPreferences() {
        const mainPreferences = JSON.parse(localStorage.getItem('servup_preferences')) || {};
        if (mainPreferences.username) {
            restaurantNameInput.value = mainPreferences.username;
        }
        if (mainPreferences.darkMode) {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        const accessibilitySettings = JSON.parse(localStorage.getItem(ACCESSIBILITY_PREFERENCES_KEY)) || {};
        applyAccessibilitySettings(accessibilitySettings);

        // Update UI elements in settings page
        if (document.getElementById('fontSize')) {
            document.getElementById('fontSize').value = accessibilitySettings.fontSize || 'normal';
        }
        if (document.getElementById('readableFont')) {
            document.getElementById('readableFont').checked = !!accessibilitySettings.readableFont;
        }
        if (document.getElementById('highlightLinks')) {
            document.getElementById('highlightLinks').checked = !!accessibilitySettings.highlightLinks;
        }
        if (document.getElementById('highContrastMode')) {
            document.getElementById('highContrastMode').checked = !!accessibilitySettings.highContrastMode;
        }
    }

    // Function to save accessibility preferences
    function saveAccessibilityPreferences() {
        const settings = {
            fontSize: document.getElementById('fontSize') ? document.getElementById('fontSize').value : 'normal',
            readableFont: document.getElementById('readableFont') ? document.getElementById('readableFont').checked : false,
            highlightLinks: document.getElementById('highlightLinks') ? document.getElementById('highlightLinks').checked : false,
            highContrastMode: document.getElementById('highContrastMode') ? document.getElementById('highContrastMode').checked : false,
        };
        localStorage.setItem(ACCESSIBILITY_PREFERENCES_KEY, JSON.stringify(settings));
        applyAccessibilitySettings(settings);
        // No toast here for now, as changes are instant. Could add if desired.
    }

    // Event listeners for accessibility controls to apply and save on change
    if (document.getElementById('fontSize')) {
        document.getElementById('fontSize').addEventListener('change', saveAccessibilityPreferences);
    }
    if (document.getElementById('readableFont')) {
        document.getElementById('readableFont').addEventListener('change', saveAccessibilityPreferences);
    }
    if (document.getElementById('highlightLinks')) {
        document.getElementById('highlightLinks').addEventListener('change', saveAccessibilityPreferences);
    }
    if (document.getElementById('highContrastMode')) {
        document.getElementById('highContrastMode').addEventListener('change', saveAccessibilityPreferences);
    }

    // Initial load of all preferences
    loadAllPreferences();
}); 