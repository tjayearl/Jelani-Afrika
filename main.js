document.addEventListener('DOMContentLoaded', () => {
    const authNavLinkContainer = document.getElementById('auth-nav-link-container');
    const authLink = authNavLinkContainer?.querySelector('a');
    const claimsNavLink = document.querySelector('a[href="#claims"]');

    const authSection = document.getElementById('auth-section');
    const claimsSection = document.getElementById('claims');
    const closeModalButton = document.getElementById('auth-modal-close');
    const claimsWelcome = document.getElementById('claims-welcome-message');
    const claimsContent = document.getElementById('claims-content');

    const isLoggedIn = !!localStorage.getItem('access_token');

    if (isLoggedIn) {
        // --- USER IS LOGGED IN ---
        if (authLink) authLink.textContent = 'Logout';
        if (authSection) authSection.style.display = 'none'; // Hide login/register
        if (claimsSection) claimsSection.style.display = 'block';

        // Auto-Fill & Personalization: Fetch user profile
        (async () => {
            const profileResult = await getUserProfile();
            if (profileResult.ok && claimsWelcome) {
                const user = profileResult.data;
                claimsWelcome.textContent = `Welcome, ${user.full_name || 'Valued Client'}!`;
                sessionStorage.setItem('userProfile', JSON.stringify(user)); // Store for claims.js to use
            }
        })();

        // Inject claims form and dashboard into the claims content area
        claimsContent.innerHTML = `
            <p class="auth-info">Submit your claim quickly and easily. Please provide your policy number and a short description.</p>
            <form id="claimForm" class="auth-form active">
                <div class="wizard-progress" style="margin-bottom: 1.5rem;">
                    <div class="progress-bar" style="width: 0%;"></div>
                </div>
                <div class="auth-message success" id="claim-success-message" style="display: none;"></div>
                <!-- Step 1: Policy Verification -->
                <div class="claim-step active" data-step="1">
                    <div class="form-group">
                        <label for="policy_number">Policy Number</label>
                        <input id="policy_number" name="policy_number" placeholder="e.g., POL-123456" required>
                    </div>
                    <div class="auth-error" style="display: none;"></div>
                    <button type="button" class="btn wizard-next">Next: Claim Details <i class="fas fa-arrow-right"></i></button>
                </div>
                <!-- Step 2: Claim Details -->
                <div class="claim-step" data-step="2" style="display: none;">
                    <div class="auth-error" style="display: none;"></div>
                    <div class="form-group">
                        <label for="claim_type">Claim Type</label>
                        <select id="claim_type" name="claim_type" required>
                            <option value="" disabled selected>-- Select Claim Type --</option>
                            <option value="Accident">Accident</option>
                            <option value="Theft">Theft</option>
                            <option value="Fire">Fire</option>
                            <option value="Medical">Medical</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" placeholder="Describe what happened (e.g., date, location, damage details)..." required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="claim_files">Supporting Documents (Optional)</label>
                        <div class="file-upload-wrapper">
                            <input type="file" id="claim_files" name="claim_files" class="file-input" multiple>
                            <button type="button" class="btn-file-upload" tabindex="-1"><i class="fas fa-paperclip"></i> Choose Files</button>
                            <span class="file-name">No files chosen</span>
                        </div>
                    </div>
                    <div class="wizard-nav" style="margin-top: 0; padding-top: 0;">
                        <button type="button" class="btn btn-outline wizard-prev"><i class="fas fa-arrow-left"></i> Previous</button>
                        <button type="submit" class="btn">Submit Claim</button>
                    </div>
                </div>
            </form>
            <div class="claims-dashboard">
                <h3>Your Claims</h3>
                <div id="claimsList"></div>
            </div>
        `;

        authLink?.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.reload();
        });
    } else {
        // --- USER IS NOT LOGGED IN ---
        if (authLink) authLink.textContent = 'Login / Register';
        if (claimsSection) claimsSection.style.display = 'none'; // Hide claims

        // Open modal on click
        authLink?.addEventListener('click', (e) => {
            e.preventDefault();
            if (authSection) {
                authSection.classList.add('visible');
            }
        });
    }

    // Close modal logic
    closeModalButton?.addEventListener('click', () => authSection.classList.remove('visible'));
    authSection?.addEventListener('click', (e) => { if (e.target === authSection) authSection.classList.remove('visible'); });

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only prevent default for actual section links, not for logout action
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
                        <option value="Theft">Theft</option>
                        <option value="Fire">Fire</option>
                        <option value="Medical">Medical</option>
                        <option value="Other">Other</option>
                    </select>
                    <textarea name="description" placeholder="Describe what happened (e.g., date, location, damage details)..." required></textarea>
                    <div class="file-upload-wrapper">
                        <input type="file" id="claim_files" name="claim_files" class="file-input" multiple>
                        <button type="button" class="btn-file-upload" tabindex="-1"><i class="fas fa-paperclip"></i> Choose Files (Optional)</button>
                        <span class="file-name">No files chosen</span>
                    </div>
                    <div class="wizard-nav" style="margin-top: 0; padding-top: 0;">
                        <button type="button" class="btn btn-outline wizard-prev"><i class="fas fa-arrow-left"></i> Previous</button>
                        <button type="submit" class="btn">Submit Claim</button>
                    </div>
                </div>
            </form>
            <div class="claims-dashboard">
                <h3>Your Claims</h3>
                <div id="claimsList"></div>
            </div>
        `;

        authLink?.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        // --- USER IS NOT LOGGED IN ---
        if (authLink) authLink.textContent = 'Login / Register';
        if (authSection) authSection.style.display = 'block'; // Show login/register
        if (claimsSection) claimsSection.style.display = 'none'; // Hide claims
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Only prevent default for actual section links, not for logout action
            if (href !== '#') {
                e.preventDefault();
                document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});