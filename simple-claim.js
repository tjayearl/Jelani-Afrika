document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('simple-claim-form');
    if (!claimForm) return;

    const formWrapper = document.querySelector('.claims-layout-wrapper');
    const submitButton = claimForm.querySelector('button[type="submit"]');

    claimForm.addEventListener('submit', (e) => {
        // This event listener now only handles the UI change on submission.
        // The e.preventDefault() is removed, so the form will submit normally to the 'action' URL.
        // --- 1. Show loading state ---
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting… <i class="fas fa-spinner fa-spin"></i>';
    });
});