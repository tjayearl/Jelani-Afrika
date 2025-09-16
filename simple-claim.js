document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('simple-claim-form');
    if (!claimForm) return;

    const formWrapper = document.querySelector('.claims-layout-wrapper');
    const submitButton = claimForm.querySelector('button[type="submit"]');

    claimForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- 1. Show loading state ---
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting… <i class="fas fa-spinner fa-spin"></i>';

        // Remove previous messages
        const existingMessage = document.querySelector('.form-submission-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // --- 2. Prepare and send data ---
        const formData = new FormData(claimForm);
        // In a real scenario, you would send this to your backend.
        // We will simulate a successful API call.
        // const response = await apiFetch('/simple-claim/', { method: 'POST', body: formData });

        // --- 3. Simulate API call for demonstration ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        const isSuccess = true; // Change to false to test error state

        // --- 4. Handle response ---
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;

        const messageDiv = document.createElement('div');
        messageDiv.className = 'form-submission-message';

        if (isSuccess) {
            messageDiv.innerHTML = '✅ Your claim has been submitted successfully. Our team will review it and contact you shortly.';
            claimForm.reset();
        }

        formWrapper.after(messageDiv); // Place the message after the entire card
    });
});