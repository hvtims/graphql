export function renderUserProfile(login, firstName, lastName, email, xp, campus, region, profileImage) {
 const root = document.getElementById('profile-root');
  if (!root) return;

  root.innerHTML = `
    <section class="profile-page-container">
      <article class="profile-card fade-in">
        <div class="profile-avatar pulse">
          <img
            src="${profileImage}"
            alt="${firstName}'s profile picture"
            class="avatar-img"
            onerror="this.src='https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=7b1fa2&color=fff&size=150'"
          >
        </div>

        <h1>
          Welcome&nbsp;<span class="accent-text">${firstName}</span>
        </h1>
        <div class="profile-grid">
          <div class="profile-row"><strong>Login: </strong><span>${login}</span></div>
          <div class="profile-row"><strong>First Name: </strong><span>${firstName}</span></div>
          <div class="profile-row"><strong>Last Name: </strong><span>${lastName}</span></div>
          <div class="profile-row"><strong>Email: </strong><span>${email}</span></div>
          <div class="profile-row"><strong>Campus: </strong><span>${campus}</span></div>
          <div class="profile-row"><strong>XP: </strong><span>${xp}</span></div>
          <div class="profile-row"><strong>Region: </strong><span>${region}</span></div>
        </div>
      </article>
    </section>
  `;
}

export function renderAuditData(total, success, fail, winrate, loserate) {
  const root = document.getElementById('audit-root')
  if (!root) return
  root.innerHTML = `
    <div class="auth-form-container">
      <div class="auth-form">
        <h2>Audit Statistics</h2>
        <div class="win-rate-display">${winrate}</div>


     <svg width="100%" height="60" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif" font-size="3">
  <!-- Background Track -->
  <rect x="0" y="5" width="100" height="6" fill="#e0e0e0" rx="3" />
  
  <!-- Win Progress (adjust width with ${winrate}) -->
  <rect x="0" y="5" width="${winrate}" height="6" fill="#4caf50" rx="3" />

  <!-- Lose Progress (placed after win) -->
  <rect x="${winrate}" y="5" width="${loserate}" height="6" fill="#f44336" rx="0" />

  <!-- Labels -->
  <text x="0" y="18" fill="#000">0%</text>
  <text x="47.5" y="18" fill="#000">50%</text>
  <text x="94" y="18" fill="#000">100%</text>
</svg>
        <div class="audit-details">
          <p class="profile-row"><strong>Total Audits:</strong> ${total}</p>
          <p class="profile-row"><strong>Success:</strong> ${success}</p>
          <p class="profile-row"><strong>Fail:</strong> ${fail}</p>
          <p class="profile-row"><strong>Succes rate Rate:</strong> ${winrate}</p>
          <p class="profile-row"><strong>Fail rate Rate:</strong> ${loserate}</p>
        </div>
      </div>
    </div>`
}
