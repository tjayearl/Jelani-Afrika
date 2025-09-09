// script.js - put this in your frontend and include <script src="/script.js"></script>
const BASE_URL = "https://jelani-backend.onrender.com/api"; // deployed backend

function showLoading(el, on=true){
  if(!el) return;
  el.dataset.loading = on ? "1" : "0";
}

// generic API helper
async function apiCall(path, {method='GET', body=null, auth=false, headers={}}={}){
  const url = `${BASE_URL}${path}`;
  const opts = { method, headers: {...headers} };
  if(body && typeof body === 'object' && !(body instanceof FormData)){
    opts.body = JSON.stringify(body);
    opts.headers['Content-Type'] = 'application/json';
  } else if(body instanceof FormData){
    opts.body = body; // browser sets Content-Type
  }
  if(auth){
    const token = localStorage.getItem('access_token');
    if(token) opts.headers['Authorization'] = `Bearer ${token}`;
  }
  try{
    const res = await fetch(url, opts);
    const text = await res.text();
    try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
    catch(_) { return { ok: res.ok, status: res.status, data: text }; }
  }catch(err){
    return { ok:false, status: 0, error: err.message || String(err) };
  }
}

// register
async function registerUser({username, email, password, password2, phone}, resultEl){
  showLoading(resultEl, true);
  const r = await apiCall('/user/register/', { method:'POST', body:{username, email, password, password2, phone} });
  showLoading(resultEl, false);
  return r;
}

// login (JWT token)
async function loginUser({username, password}, resultEl){
  showLoading(resultEl, true);
  const r = await apiCall('/token/', { method:'POST', body:{username,password} });
  showLoading(resultEl, false);
  if(r.ok && r.data && r.data.access){
    localStorage.setItem('access_token', r.data.access);
    localStorage.setItem('refresh_token', r.data.refresh || '');
  }
  return r;
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