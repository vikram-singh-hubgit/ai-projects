const welcomeTitle = document.getElementById('welcomeTitle');
const logoutBtn = document.getElementById('logoutBtn');

const userRaw = localStorage.getItem('user');

if (!userRaw) {
  window.location.href = '/';
} else {
  const user = JSON.parse(userRaw);
  const name = user.name || user.email || 'there';
  welcomeTitle.textContent = `Welcome, ${name}`;
}

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
});
