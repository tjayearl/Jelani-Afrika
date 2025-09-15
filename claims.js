// claims.js
document.addEventListener("DOMContentLoaded", () => {
  // This script might run before the claims form is injected by main.js.
  // We'll use a MutationObserver to wait for the form to appear.
  const observer = new MutationObserver((mutations, obs) => {
    const claimForm = document.getElementById("claimForm");
    if (claimForm) {
      initializeClaimsForm(claimForm);
      obs.disconnect(); // Stop observing once the form is found and initialized
    }
  });

  // Start observing the claims content area for changes
  const claimsContent = document.getElementById('claims-content');
  if (claimsContent) {
    observer.observe(claimsContent, {
      childList: true,
      subtree: true
    });
  }
});

function initializeClaimsForm(claimForm) {
  const claimsList = document.getElementById("claimsList");
  const steps = claimForm.querySelectorAll('.claim-step');
  const progressBar = claimForm.querySelector('.progress-bar');
  const fileInput = claimForm.querySelector('#claim_files');
  let currentStep = 1;

  function prefillPolicy() {
    // Auto-Fill & Personalization: Use stored profile data
    const input = document.querySelector('input[name="policy_number"]');
    const userProfile = JSON.parse(sessionStorage.getItem('userProfile'));
    if (input && userProfile && userProfile.policy_number) {
      input.value = userProfile.policy_number;
    } else if (input) {
      // Fallback if no policy number is found
      input.placeholder = "Enter Your Policy Number";
    }
  }

  async function loadClaims() {
    const res = await apiFetch("/claims/");
    if (!res.ok) return;
    const claims = await res.json();
    if (!claimsList) return;
    claimsList.innerHTML = claims
      .map((c) => `
        <div class="claim-card">
          <h4>${c.policy_number ?? "No Policy #"}: ${c.claim_type}</h4>
          <p>${c.description}</p>
          <div class="claim-status-tag ${c.status?.toLowerCase()}">
            Status: ${c.status}
          </div>
        </div>`
      )
      .join("");
  }

  function goToStep(stepNumber) {
    currentStep = stepNumber;
    steps.forEach(step => {
        step.style.display = 'none';
        if (parseInt(step.dataset.step) === currentStep) {
            step.style.display = 'block';
        }
    });
    updateProgressBar();
  }

  function updateProgressBar() {
    if (!progressBar) return;
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // --- Real-Time Feedback Helpers ---
  function displayStepError(step, message) {
    const errorDiv = step.querySelector('.auth-error');
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = 'block';
    }
  }

  function hideStepError(step) {
    const errorDiv = step.querySelector('.auth-error');
    if (errorDiv) errorDiv.style.display = 'none';
  }

  claimForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(claimForm);
    const successMessage = document.getElementById('claim-success-message');
    // Send as FormData to support file uploads.
    // The apiFetch helper is smart enough to handle this without setting Content-Type.
    const res = await apiFetch("/claims/", { method: "POST", body: formData });
    if (res.ok) {
      const newClaim = await res.json();
      if(successMessage) {
        // Include claim ID from backend response
        successMessage.innerHTML = `
          <p>✅ Your claim (ID: <strong>${newClaim.claim_id || 'N/A'}</strong>) has been submitted successfully. Our team will contact you soon.</p>
          <p>An email confirmation has been sent to your registered address.</p>
          <a href="claim-status.html?id=${newClaim.claim_id}" class="btn btn-outline" style="margin-top: 1rem;">Track My Claim</a>
        `;
        successMessage.style.display = 'block';
      }
      claimForm.reset();
      prefillPolicy();
      loadClaims();
      goToStep(1); // Go back to the first step for the next submission
      // Keep the success message visible until the user navigates away or submits another claim.
    } else {
      // If backend returns 400/401, display a clear error
      const step2 = claimForm.querySelector('.claim-step[data-step="2"]');
      if (res.status === 400 || res.status === 401) {
        displayStepError(step2, "We couldn’t submit your claim. Please check your policy number or try again.");
      } else {
        const err = await res.json();
        displayStepError(step2, `Failed: ${JSON.stringify(err)}`);
      }
    }
  });

  // Step navigation listeners
  const nextButton = claimForm.querySelector('.wizard-next');
  const prevButton = claimForm.querySelector('.wizard-prev');

  nextButton?.addEventListener('click', () => {
    // Validation Before Submit: Check policy number
    const step1 = claimForm.querySelector('.claim-step[data-step="1"]');
    const policyInput = step1.querySelector('input[name="policy_number"]');
    hideStepError(step1);

    if (!policyInput.value.trim()) {
      displayStepError(step1, "Policy number is required.");
    } else {
      goToStep(2);
    }
  });

  prevButton?.addEventListener('click', () => {
    goToStep(1);
  });

  // File input listener
  if (fileInput) {
    fileInput.addEventListener('change', () => {
      const fileNameSpan = claimForm.querySelector('.file-name');
      if (!fileNameSpan) return;
      const numFiles = fileInput.files.length;
      if (numFiles > 1) {
        fileNameSpan.textContent = `${numFiles} files selected`;
      } else if (numFiles === 1) {
        fileNameSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameSpan.textContent = 'No files chosen';
      }
    });
  }
  // Only run this logic if the user is logged in and the form is visible
  if (getToken() && claimForm) {
    prefillPolicy();
    loadClaims();
  }
}