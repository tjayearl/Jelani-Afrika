// claims.js
document.addEventListener("DOMContentLoaded", () => {
  const claimForm = document.getElementById("claimForm");
  const claimsList = document.getElementById("claimsList");

  function prefillPolicy() {
    const input = document.querySelector('input[name="policy_number"]');
    if (input) input.value = "POL-" + Math.floor(Math.random() * 1000000);
  }

  async function loadClaims() {
    const res = await apiFetch("/claims/");
    if (!res.ok) return;
    const claims = await res.json();
    if (!claimsList) return;
    claimsList.innerHTML = claims
      .map(
        (c) => `<div class="policy-item-detailed">
          <div class="policy-info">
            <h4>${c.policy_number ?? "No Policy #"}: ${c.claim_type}</h4>
            <p><em>${c.description}</em></p>
          </div>
          <div class="policy-actions">
            <span class="status-review">${c.status}</span>
          </div>
        </div>`
      )
      .join("");
  }

  claimForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(claimForm).entries());
    // Note: This does not support file uploads. For files, FormData should be used directly.
    const res = await apiFetch("/claims/", { method: "POST", body: JSON.stringify(data), headers: {'Content-Type': 'application/json'} });
    if (res.ok) {
      alert("Claim submitted!");
      claimForm.reset();
      prefillPolicy();
      loadClaims();
    } else {
      const err = await res.json();
      alert("Failed: " + JSON.stringify(err));
    }
  });

  if (!getToken()) {
    alert("Please login first.");
    window.location.href = "login.html";
  } else {
    prefillPolicy();
    loadClaims();
  }
});