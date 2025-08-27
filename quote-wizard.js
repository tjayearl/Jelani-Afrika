document.addEventListener('DOMContentLoaded', () => {
  const openWizardButtons = document.querySelectorAll('.js-open-quote-wizard');
  const modal = document.getElementById('quote-wizard-modal');
  const closeModalButton = document.querySelector('.modal-close');
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const nextButtons = document.querySelectorAll('.wizard-next');
  const prevButtons = document.querySelectorAll('.wizard-prev');
  const progressBar = document.querySelector('.progress-bar');
  const startOverButton = document.querySelector('.wizard-start-over');
  const radioOptions = document.querySelectorAll('.options-grid input[type="radio"]');

  let currentStep = 1;
  const totalSteps = 4; // Including the result step
  const userSelections = {};

  const showModal = () => {
    if (!modal) return;
    modal.style.display = 'flex';
    // Use a timeout to allow the display property to apply before adding the class for transition
    setTimeout(() => modal.classList.add('visible'), 10);
  };

  const hideModal = () => {
    if (!modal) return;
    modal.classList.remove('visible');
    // Wait for the transition to finish before hiding
    setTimeout(() => {
      modal.style.display = 'none';
      // Reset to first step when closing
      goToStep(1, true);
    }, 300); // Should match transition duration
  };

  const goToStep = (stepNumber, isResetting = false) => {
    currentStep = stepNumber;
    wizardSteps.forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.dataset.step) === currentStep) {
        step.classList.add('active');
      }
    });
    updateProgressBar();

    if (isResetting) {
        // Clear selections
        for (const key in userSelections) {
            delete userSelections[key];
        }
        document.querySelectorAll('.options-grid input[type="radio"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('.wizard-next').forEach(btn => btn.disabled = true);
    }
  };

  const updateProgressBar = () => {
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  };
  
  const calculateQuote = () => {
    let base = 3000; // Base premium in KES
    
    // Adjust based on insurance type
    switch(userSelections.insuranceType) {
      case 'car': base += 2000; break;
      case 'health': base += 1500; break;
      case 'business': base += 5000; break;
      case 'life': base += 1000; break;
      case 'home': base += 1200; break;
    }

    // Adjust based on age
    switch(userSelections.ageGroup) {
      case 'under25': base *= 1.2; break;
      case '41-60': base *= 1.3; break;
      case 'over60': base *= 1.6; break;
    }

    // Adjust based on budget
    base += parseInt(userSelections.budget) * 10;

    return Math.round(base);
  };

  // Enable/disable next button based on selection
  const checkSelection = (stepElement) => {
    const nextBtn = stepElement.querySelector('.wizard-next');
    if (!nextBtn) return;
    const question = stepElement.querySelector('.options-grid').dataset.question;
    
    if (userSelections[question]) {
      nextBtn.disabled = false;
    } else {
      nextBtn.disabled = true;
    }
  };

  // --- Event Listeners ---
  openWizardButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); showModal(); }));
  closeModalButton.addEventListener('click', hideModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) hideModal(); });

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        if (currentStep === totalSteps - 1) { // If on the last question step
          const quote = calculateQuote();
          document.getElementById('quote-amount').textContent = quote.toLocaleString();
        }
        goToStep(currentStep + 1);
      }
    });
  });

  prevButtons.forEach(button => button.addEventListener('click', () => { if (currentStep > 1) goToStep(currentStep - 1); }));
  radioOptions.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const question = e.target.name;
      const answer = e.target.value;
      userSelections[question] = answer;
      checkSelection(e.target.closest('.wizard-step'));
    });
  });
  
  startOverButton.addEventListener('click', () => goToStep(1, true));

  // Handle opening modal from other pages via URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const quoteAction = urlParams.get('quote');
  if (quoteAction) {
    showModal();
    const radio = document.querySelector(`input[name="insuranceType"][value="${quoteAction}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change', { bubbles: true })); 
      goToStep(2);
    }
  }

  // --- Contact Form Submission ---
  const contactForm = document.getElementById('main-contact-form');
  const successMessage = document.getElementById('form-success-message');

  if (contactForm && successMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // In a real application, you would send the form data to a server here.
      // File uploads require server-side code (e.g., PHP, Node.js, Python) to process.
      // For this demo, we'll just show the success message.
      contactForm.style.display = 'none';
      successMessage.style.display = 'block';

      // Reset the form for potential future use
      contactForm.reset(); 
      const fileNameSpan = document.querySelector('.file-name');
      if (fileNameSpan) {
        fileNameSpan.textContent = 'No file chosen';
        fileNameSpan.style.fontStyle = 'italic';
        fileNameSpan.style.color = '#666';
      }
    });
  }

  // --- Contact Form File Input Display ---
  const fileInput = document.getElementById('contact-file');
  const fileNameSpan = document.querySelector('.file-name');
  if (fileInput && fileNameSpan) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        fileNameSpan.textContent = fileInput.files[0].name;
        fileNameSpan.style.fontStyle = 'normal';
      }
    });
  }
});