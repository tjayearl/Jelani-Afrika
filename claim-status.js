document.addEventListener('DOMContentLoaded', () => {
  const statusForm = document.getElementById('claim-status-form');
  const resultDiv = document.getElementById('claim-status-result');
  const claimIdInput = document.getElementById('claim-id');

  if (!statusForm) return;

  statusForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const claimId = claimIdInput.value.trim().toUpperCase();
    const button = statusForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerHTML = 'Tracking... <i class="fas fa-spinner fa-spin"></i>';

    let html = '';
    try {
      const result = await getClaimStatus(claimId);
      if (result.ok) {
        const data = result.data;
        html = `
          <hr>
          <h4>Status for Claim ID: ${claimId}</h4>
          <p><strong>Policy Number:</strong> ${data.policy_number}</p>
          <p><strong>Current Status:</strong> ${data.status}</p>
          <div class="status-timeline">
            ${data.steps.map((step, index) => `
              <div class="status-step ${index + 1 <= data.current_step ? 'completed' : ''}">
                <div class="status-dot"></div>
                <div class="status-label">${step}</div>
              </div>
            `).join('')}
          </div>
          <h4>Recent Updates:</h4>
          <div class="status-updates">
            ${data.updates.length > 0 ? data.updates.map(update => `<p>${update.description} (${new Date(update.timestamp).toLocaleDateString()})</p>`).join('') : '<p>No updates available yet.</p>'}
          </div>
        `;
      } else {
        const errorMessage = result.status === 404
          ? `Sorry, we could not find a claim with the ID "${claimId}". Please check the ID and try again.`
          : 'An error occurred while fetching claim status. Please try again later.';
        html = `<hr><p class="error-message">${errorMessage}</p>`;
      }
    } catch (error) {
      html = `<hr><p class="error-message">An error occurred while fetching claim status. Please try again later.</p>`;
    }
    finally {
        button.disabled = false;
        button.innerHTML = 'Track Status';
    }

    resultDiv.innerHTML = html;
    resultDiv.style.display = 'block';
  });
});