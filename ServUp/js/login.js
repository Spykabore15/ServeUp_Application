document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');

    // Redirect to dashboard if already logged in
    if (localStorage.getItem('loggedInUser')) {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loginError.textContent = ''; // Clear previous error messages

        const username = loginForm.username.value;
        const password = loginForm.password.value;

        if (mockUsers[username] && mockUsers[username].password === password) {
            const user = {
                username: username,
                role: mockUsers[username].role
            };
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            window.location.href = 'dashboard.html';
        } else {
            loginError.textContent = 'Nom d\'utilisateur ou mot de passe incorrect.';
        }
    });
}); 