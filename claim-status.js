document.addEventListener('DOMContentLoaded', () => {
  const statusForm = document.getElementById('claim-status-form');
  const resultDiv = document.getElementById('claim-status-result');
  const claimIdInput = document.getElementById('claim-id');

  if (!statusForm) return;

  const mockClaimData = {
    "CLM-12345": {
      policyNumber: "POL-98765",
      status: "Under Review",
      submittedDate: "15 October 2023",
      currentStep: 2,
      steps: ["Claim Received", "Under Review", "Awaiting Documents", "Final Decision"],
      updates: [
        "Your claim is currently being reviewed by our team. We will contact you if we need more information. (16 October 2023)"
      ]
    },
    "CLM-67890": {
      policyNumber: "POL-11223",
      status: "Settled",
      submittedDate: "01 September 2023",
      currentStep: 4,
      steps: ["Claim Received", "Under Review", "Settlement Approved", "Payment Processed"],
      updates: [
        "Payment has been sent to your registered bank account. (20 September 2023)",
        "Your claim has been approved for settlement. (15 September 2023)"
      ]
    }
  };

  statusForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const claimId = claimIdInput.value.trim().toUpperCase();
    const data = mockClaimData[claimId];

    let html = '';
    if (data) {
      html = `
        <hr>
        <h4>Status for Claim ID: ${claimId}</h4>
        <p><strong>Policy Number:</strong> ${data.policyNumber}</p>
        <div class="status-timeline">
          ${data.steps.map((step, index) => `
            <div class="status-step ${index + 1 <= data.currentStep ? 'completed' : ''}">
              <div class="status-dot"></div>
              <div class="status-label">${step}</div>
            </div>
          `).join('')}
        </div>
        <h4>Recent Updates:</h4>
        <div class="status-updates">
          ${data.updates.map(update => `<p>${update}</p>`).join('')}
        </div>
      `;
    } else {
      html = `<hr><p class="error-message">Sorry, we could not find a claim with the ID "${claimId}". Please check the ID and try again.</p>`;
    }

    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
  });
});