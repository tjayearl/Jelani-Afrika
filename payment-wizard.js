document.addEventListener('DOMContentLoaded', () => {
  const paymentWizard = document.getElementById('payment-wizard');
  if (!paymentWizard) return; // Only run on the payment page

  const steps = paymentWizard.querySelectorAll('.payment-step');
  const nextButtons = paymentWizard.querySelectorAll('.payment-next');
  const prevButtons = paymentWizard.querySelectorAll('.payment-prev');
  const progressBar = paymentWizard.querySelector('.progress-bar');
  const paymentMethodRadios = paymentWizard.querySelectorAll('input[name="payment_method"]');
  const policyNumberInput = document.getElementById('policy-number');
  const displayPolicyNumber = document.getElementById('display-policy-number');
  const receiptPolicyNumber = document.getElementById('receipt-policy-number');

  let currentStep = 1;
  const totalSteps = steps.length;

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

  const updatePaymentMethodView = () => {
    if (!document.querySelector('input[name="payment_method"]:checked')) return;
    const selectedMethod = document.querySelector('input[name="payment_method"]:checked').value;
    const allDetails = paymentWizard.querySelectorAll('.payment-details-form, .payment-instructions');
    const payButton = document.querySelector('[data-step="3"] .payment-next');

    // Hide all detail sections first
    allDetails.forEach(detail => detail.style.display = 'none');

    // Show the selected one
    const selectedDetail = document.getElementById(`${selectedMethod}-details`);
    if (selectedDetail) {
      // The card form uses grid, others use block
      selectedDetail.style.display = (selectedMethod === 'card') ? 'grid' : 'block';
    }

    // Update button text and icon
    switch(selectedMethod) {
      case 'card':
        payButton.innerHTML = 'Pay Now <i class="fas fa-lock"></i>';
        break;
      case 'paypal':
        payButton.innerHTML = 'Proceed to PayPal <i class="fab fa-paypal"></i>';
        break;
      case 'mpesa':
      case 'airtel':
      case 'bank':
        payButton.innerHTML = 'Complete Payment <i class="fas fa-check"></i>';
        break;
      default:
        payButton.innerHTML = 'Pay Now <i class="fas fa-lock"></i>';
    }
  };

  // --- Event Listeners ---

  nextButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        // Logic for moving from step 1 to 2
        if (currentStep === 1 && policyNumberInput.value.trim() !== '') {
          if (displayPolicyNumber) displayPolicyNumber.textContent = policyNumberInput.value;
          if (receiptPolicyNumber) receiptPolicyNumber.textContent = policyNumberInput.value;
          goToStep(currentStep + 1);
        } else if (currentStep > 1) {
          if (currentStep === 3) { // If on the payment method step, set receipt date
            const receiptDateEl = document.getElementById('receipt-date');
            if (receiptDateEl) {
              receiptDateEl.textContent = new Date().toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric'
              });
            }
          }
          goToStep(currentStep + 1);
        } else {
            // Optional: show an error if policy number is empty
            policyNumberInput.style.borderColor = 'red';
        }
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

  paymentMethodRadios.forEach(radio => {
    radio.addEventListener('change', updatePaymentMethodView);
  });

  // Initialize view
  updatePaymentMethodView();

  // Reset border color on input
  if (policyNumberInput) {
    policyNumberInput.addEventListener('input', () => {
      if (policyNumberInput.value.trim() !== '') {
        policyNumber_input.style.borderColor = ''; // Reset border color
      }
    });
  }
});