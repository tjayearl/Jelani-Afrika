document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only prevent default for actual section links, not for external links or special cases
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});