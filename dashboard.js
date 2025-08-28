document.addEventListener('DOMContentLoaded', () => {
  // New user welcome message logic (can be removed if not needed)
  // const urlParams = new URLSearchParams(window.location.search);
  // const isNewUser = urlParams.get('new_user');
  // if (isNewUser) { ... }

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