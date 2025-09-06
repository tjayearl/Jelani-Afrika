document.addEventListener('DOMContentLoaded', () => {
  // --- Authentication & Data Loading ---
  (async () => {
    // This is an Immediately Invoked Function Expression (IIFE) to run on page load.
    protectPage(); // 🚨 Enforces login. If not logged in, this function will redirect.
    
    // Show a loading state while fetching data
    const welcomeHeader = document.querySelector('.welcome-text h1');
    if (welcomeHeader) welcomeHeader.textContent = 'Loading...';

    try {
      const data = await loadDashboardData();

      if (!data.ok) {
        // This could happen if the token is invalid or expired
        // The apiCall function already shows an error. We just need to log out.
        logout();
        return;
      }

      // --- Populate Dashboard with User Data ---
      populateDashboard(data.data);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Handle fetch error, maybe show a message
      if (welcomeHeader) welcomeHeader.textContent = 'Could not load data.';
    }
  })();

  function populateDashboard(data) {
    // Welcome message
    const welcomeHeader = document.querySelector('.welcome-text h1');
    const profileAvatar = document.querySelector('.profile-avatar');
    if (welcomeHeader) welcomeHeader.textContent = `Welcome back, ${data.user.name}!`;
    if (profileAvatar && data.user.name) profileAvatar.textContent = data.user.name.charAt(0).toUpperCase();

    // Overview cards
    document.querySelector('.overview-card-info .overview-card-number[data-type="policies"]').textContent = data.overview.active_policies;
    document.querySelector('.overview-card-info .overview-card-number[data-type="claims"]').textContent = data.overview.pending_claims;
    document.querySelector('.overview-card-info .overview-card-number[data-type="payment"]').textContent = `KES ${Number(data.overview.payment_due.amount).toLocaleString()}`;
    document.querySelector('.overview-card-info .overview-card-label[data-type="payment-due"]').textContent = `Due ${new Date(data.overview.payment_due.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    // Last login
    const lastLoginSpan = document.querySelector('.last-login');
    if (lastLoginSpan && data.user.last_login) {
      lastLoginSpan.textContent = `Last login: ${new Date(data.user.last_login).toLocaleString()}`;
    }
  }

  // --- Dashboard Section Toggling ---
  const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
  const dashboardSections = document.querySelectorAll('.dashboard-section');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const sectionId = link.dataset.section;

      // Update active link
      sidebarLinks.forEach(l => l.parentElement.classList.remove('active'));
      link.parentElement.classList.add('active');

      // Update active section
      dashboardSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `dashboard-${sectionId}`) {
          section.classList.add('active');
        }
      });
    });
  });
});