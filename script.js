// script.js - put this in your frontend and include <script src="/script.js"></script>
// Note: The BASE_URL is now in api.js

function showLoading(el, on=true){
  if(!el) return;
  el.dataset.loading = on ? "1" : "0";
}

// Generic response handler to parse JSON or text
async function handleResponse(res) {
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch(_) { return { ok: res.ok, status: res.status, data: text }; }
}

// register
async function registerUser({full_name, email, password, phone}, resultEl){
  showLoading(resultEl, true);
  const res = await apiFetch('/register/', { method:'POST', body: JSON.stringify({full_name, email, password, phone}), headers: {'Content-Type': 'application/json'} });
  const r = await handleResponse(res);
  showLoading(resultEl, false);
  return r;
}

// login (JWT token)
async function loginUser({login, password}, resultEl){
  showLoading(resultEl, true);
  const res = await apiFetch('/login/', { method:'POST', body: JSON.stringify({login, password}), headers: {'Content-Type': 'application/json'} });
  const r = await handleResponse(res);
  showLoading(resultEl, false);
  if(r.ok && r.data && r.data.access){
    saveTokens(r.data); // Use the new helper from api.js
  }
  return r;
}

// submit a new claim
async function submitClaim(formData, resultEl){
  showLoading(resultEl, true);
  // apiFetch automatically adds the token.
  // For FormData, we don't set Content-Type header.
  const res = await apiFetch('/claims/', { method:'POST', body: formData });
  const r = await handleResponse(res);
  showLoading(resultEl, false);
  return r;
}

// get list of claims
async function getClaims(){
  const res = await apiFetch('/claims/'); // GET request by default
  return await handleResponse(res);
}

// helper redirect if not logged in
function requireAuth(redirectTo='/login.html'){
  if(!localStorage.getItem('access_token')) window.location = redirectTo;
}

// logout
function logout(){
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location = '/';
}