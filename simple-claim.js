document.addEventListener('DOMContentLoaded', () => {
    const claimForm = document.getElementById('simple-claim-form');
    if (!claimForm) return;
 
    // Create a div to show success or error messages
    const messageDiv = document.createElement('div');
    messageDiv.className = 'form-message'; // For styling
    claimForm.after(messageDiv);
 
    const submitButton = claimForm.querySelector('button[type="submit"]');
 
    claimForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission
 
        // --- 1. Show loading state & clear previous messages ---
        submitButton.disabled = true;
        submitButton.innerHTML = 'Submitting… <i class="fas fa-spinner fa-spin"></i>';
        messageDiv.textContent = '';
        messageDiv.className = 'form-message'; // Reset class
 
        // --- 2. Gather form data ---
        const formData = new FormData(claimForm);
        const data = Object.fromEntries(formData.entries());
 
        // --- 3. Submit data using apiFetch ---
        try {
            // The apiFetch helper from api.js will automatically add the auth token
            const res = await apiFetch("/claims/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
 
            if (res.ok) {
                messageDiv.textContent = "✅ Claim submitted successfully! Our team will be in touch.";
                messageDiv.classList.add('success');
                claimForm.reset();
            } else {
                const errorData = await res.json();
                messageDiv.textContent = `❌ Failed: ${errorData.detail || 'Please check your details and try again.'}`;
                messageDiv.classList.add('error');
            }
        } catch (err) {
            messageDiv.textContent = "❌ A network error occurred. Please try again later.";
            messageDiv.classList.add('error');
        } finally {
            // --- 4. Reset button state ---
            submitButton.disabled = false;
            submitButton.innerHTML = 'Submit Claim Request';
        }
    });
});