document.addEventListener('DOMContentLoaded', () => {
    // Find the last list item in the main navigation, which is the auth link
    const authLi = document.querySelector('header nav ul li:last-child');
    if (!authLi) return;

    const authLink = authLi.querySelector('a');
    if (!authLink) return;

    // The new script uses 'access_token' in localStorage.
    const isLoggedIn = !!localStorage.getItem('access_token');

    if (isLoggedIn) {
        // User is logged in, show "My Profile" on most pages
        authLink.textContent = 'My Profile';
        authLink.href = 'dashboard.html';
        // The 'active' class should be on the current page's link, not this one unless on dashboard
        if (!window.location.pathname.includes('dashboard.html')) {
            authLi.classList.remove('active');
        }

        // Special handling for the dashboard page itself to show "Logout"
        if (window.location.pathname.includes('dashboard.html')) {
            authLink.textContent = 'Logout';
            authLink.href = '#'; // It's an action, not a page link
            authLi.classList.add('active'); // Make logout active on dashboard
            
            authLink.addEventListener('click', function handleLogout(e) {
                e.preventDefault();
                logout(); // Use the centralized logout function from script.js
            });
        }
    }
    // If not logged in, the default HTML is correct ("Login / Sign Up"), so no 'else' block is needed.
});