0,0 @@
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('main-contact-form');
    if (!contactForm) return;

    const successMessageDiv = document.getElementById('form-success-message');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    // Helper to log technical error details to localStorage
    const logError = (errorDetails) => {
        const logs = JSON.parse(localStorage.getItem("contactFormErrors")) || [];
        logs.push({
            time: new Date().toISOString(),
            details: errorDetails
        });
        localStorage.setItem("contactFormErrors", JSON.stringify(logs));
    };

    // Helper to create and show a temporary error message
    const showError = (message) => {
        // Remove any existing error
        const existingError = contactForm.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error form-error-message'; // Re-use existing error style
        errorDiv.textContent = message;
        // Insert before the submit button
        submitButton.parentElement.before(errorDiv);
    };

    // Helper to validate email format
    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // --- 1. Client-side Validation ---
        const name = contactForm.querySelector('#contact-name').value.trim();
        const email = contactForm.querySelector('#contact-email').value.trim();
        const subject = contactForm.querySelector('#contact-subject').value;
        const message = contactForm.querySelector('#contact-message').value.trim();

        if (!name || !email || !subject || !message) {
            showError('Please fill out all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            showError('Please enter a valid email address.');
            return;
        }

        // --- 2. API Submission with Error Handling ---
        const formData = new FormData(contactForm);

        try {
            // Use the generic apiCall from script.js.
            // Pass the FormData directly as the body. The apiCall function will handle it.
            const result = await apiCall('/contact/', { method: 'POST', body: formData }, submitButton);

            if (result.ok) {
                // Show success message
                contactForm.style.display = 'none';
                successMessageDiv.style.display = 'block';
            } else {
                // Show backend error message
                const errorMessage = result.data?.message || result.data?.detail || `Request failed with status ${result.status}.`;
                showError(errorMessage);
                logError({ status: result.status, response: result.data });
            }
        } catch (err) {
            // Show network or other unexpected errors
            showError(`A network error occurred: ${err.message}`);
            logError({ error: err.message, stack: err.stack });
        }
    });
});