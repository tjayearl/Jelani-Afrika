document.addEventListener('DOMContentLoaded', () => {
  // 🚨 Enforce login before anything else happens on this page. 
  // This aligns with the user's request to protect the page.
  // The token name is 'access_token' as defined in script.js
  if (!localStorage.getItem("access_token")) {
    alert("You must be logged in to file a claim.");
    window.location.href = "/login.html";
  }
  
  const claimForm = document.getElementById('claim-form');
  if (!claimForm) return; // Only run on the claims page

  const steps = claimForm.querySelectorAll('.claim-step');
  const nextButtons = claimForm.querySelectorAll('.claim-next');
  const prevButtons = claimForm.querySelectorAll('.claim-prev');
  const saveButtons = claimForm.querySelectorAll('.claim-save');
  const progressBar = claimForm.querySelector('.progress-bar');
  const successMessage = document.getElementById('claim-success-message');
  const fileInput = document.getElementById('claim-files');
  const claimsListDiv = document.getElementById('claimsList');
  const fileNameSpan = claimForm.querySelector('.file-name');

  let currentStep = 1;
  const totalSteps = steps.length;
  const STORAGE_KEY = 'jelani-claim-draft';

  const goToStep = (stepNumber) => {
    currentStep = stepNumber;
    steps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add('active');
      }
    });
    updateProgressBar();
  };

  const updateProgressBar = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  };

  const populateReviewStep = () => {
    document.getElementById('review-name').textContent = document.getElementById('name').value || 'N/A';
    document.getElementById('review-policy-number').textContent = document.getElementById('policy-number').value || 'N/A';
    document.getElementById('review-email').textContent = document.getElementById('email').value || 'N/A';
    document.getElementById('review-phone').textContent = document.getElementById('phone').value || 'N/A';
    document.getElementById('review-incident-date').textContent = document.getElementById('incident-date').value || 'N/A';
    const claimTypeSelect = document.getElementById('claim-type');
    document.getElementById('review-claim-type').textContent = claimTypeSelect.options[claimTypeSelect.selectedIndex].text || 'N/A';
    document.getElementById('review-claim-amount').textContent = `KES ${document.getElementById('claim-amount').value || '0'}`;
    document.getElementById('review-description').textContent = document.getElementById('description').value || 'N/A';

    const numFiles = fileInput.files.length;
    document.getElementById('review-files').textContent = numFiles > 0 ? `${numFiles} file(s) selected` : 'No files uploaded';
  };

  const saveProgress = () => {
    const formData = new FormData(claimForm);
    const data = {};
    for (let [key, value] of formData.entries()) {
      // We don't save file objects, just a note that they exist.
      if (key !== 'claim_files') {
        data[key] = value;
      }
    }
    data.currentStep = currentStep;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert('Your progress has been saved! You can close this window and continue later.');
  };

  const loadProgress = () => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const data = JSON.parse(savedData);
      for (const key in data) {
        const input = claimForm.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === 'radio') {
            claimForm.querySelector(`[name="${key}"][value="${data[key]}"]`).checked = true;
          } else {
            input.value = data[key];
          }
        }
      }
      goToStep(data.currentStep || 1);
      return true;
    }
    return false;
  };

  const hideResumeModal = () => {
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
      resumeModal.classList.remove('visible');
      setTimeout(() => {
        resumeModal.style.display = 'none';
      }, 300); // Match CSS transition duration
    }
  };

  const discardProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    hideResumeModal();
  };

  // Check for saved session on page load
  if (localStorage.getItem(STORAGE_KEY)) {
    const resumeModal = document.getElementById('resume-modal');
    if (resumeModal) {
      resumeModal.style.display = 'flex';
      // Use a timeout to allow the display property to apply before adding the class for transition
      setTimeout(() => resumeModal.classList.add('visible'), 10);
    }
  }

  // --- Function to fetch and display claims ---
  const displayClaims = async () => {
    const claimsListDiv = document.getElementById("claimsList");
    if (!claimsListDiv) return;

    // Using getClaims() from script.js which handles auth headers
    const result = await getClaims(); 

    if (result.ok) {
      const claims = result.data;
      // This rendering logic is taken from your provided snippet
      claimsListDiv.innerHTML = claims.map(
        c => `<div><strong>${c.policy_number}</strong> - ${c.claim_type} <br/> ${c.description}</div>`
      ).join("");
      if (claims.length === 0) {
        claimsListDiv.innerHTML = "<p>You have not filed any claims yet.</p>";
      }
    } else {
      claimsListDiv.innerHTML = `<p class="auth-error">Failed to load claims: ${JSON.stringify(result.data)}</p>`;
    }
  };


  // --- Event Listeners ---

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        if (currentStep === totalSteps - 1) { // When moving to the final review step
          populateReviewStep();
        }
        goToStep(currentStep + 1);
      }
    });
  });

  prevButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  });

  saveButtons.forEach(button => {
    button.addEventListener('click', saveProgress);
  });

  if (fileInput && fileNameSpan) {
    fileInput.addEventListener('change', () => {
      const numFiles = fileInput.files.length;
      if (numFiles > 1) {
        fileNameSpan.textContent = `${numFiles} files selected`;
      } else if (numFiles === 1) {
        fileNameSpan.textContent = fileInput.files[0].name;
      } else {
        fileNameSpan.textContent = 'No files chosen';
      }
      fileNameSpan.style.fontStyle = numFiles > 0 ? 'normal' : 'italic';
    });
  }

  if (claimForm && successMessage) {
    claimForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(claimForm);
      const button = claimForm.querySelector('button[type="submit"]');
      button.disabled = true;
      button.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';

      try {
        // Use the new submitClaim function from script.js
        const result = await submitClaim(formData, button);

        if (result.ok) {
          claimForm.style.display = 'none';
          document.querySelector('.claim-wizard-wrapper h2').style.display = 'none';
          successMessage.style.display = 'block';
          localStorage.removeItem(STORAGE_KEY);
          alert("✅ Claim submitted!");
          // Reload the claims list to show the new submission
          displayClaims(); 
        } else {
          // Show error from backend
          const error = result.data;
          alert("❌ Failed: " + JSON.stringify(error));
        }
      } catch (error) {
        alert('❌ An unexpected error occurred during submission. Please try again.');
      } finally {
        // Always re-enable the button
        button.disabled = false;
        button.innerHTML = 'Submit Claim <i class="fas fa-paper-plane"></i>';
      }
    });
  }

  // Resume Modal Listeners
  const resumeButton = document.getElementById('resume-session');
  const discardButton = document.getElementById('discard-session');
  if (resumeButton && discardButton) {
    resumeButton.addEventListener('click', () => {
      loadProgress();
      hideResumeModal();
    });
    discardButton.addEventListener('click', discardProgress);
  }

  // Initial call to load claims history
  displayClaims();
});