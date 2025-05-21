
export function renderUserProfile( login, firstName, lastName, email , xp , campus , region) {
  const root = document.getElementById('profile-root')
  if (!root) return
  root.innerHTML = `
      <h1> Welcome Dear ${firstName} </h1>
    <div class="auth-form-container">
      <div class="auth-form">
        <h2>My Zone01 Profile</h2>
        <p class="profile-row"><strong>Login:</strong> ${login}</p>
        <p class="profile-row"><strong>First Name:</strong> ${firstName}</p>
        <p class="profile-row"><strong>Last Name:</strong> ${lastName}</p>
        <p class="profile-row"><strong>Email:</strong> ${email}</p>
        <p class="profile-row"><strong>Campus:</strong> ${campus}</p>
        <p class="profile-row"><strong>Xp:</strong> ${xp}</p>
        <p class="profile-row"><strong>Region:</strong> ${region}</p>
      </div>
    </div>`
}
export function renderAuditData(total, success, fail, winrate, loserate) {
  const root = document.getElementById('audit-root');
  
  if (!root) return;
  
  root.innerHTML = `
    <div class="auth-form-container">
      <div class="auth-form">
        <h2>Audit Statistics</h2>
        
        <!-- Large percentage display -->
        <div class="win-rate-display">${winrate}</div>
        
        <!-- Combined win/lose progress bar -->
        <div class="audit-progress">
          <div class="progress-track">
            <div class="win-progress" style="width: ${winrate}"></div>
            <div class="lose-progress" style="width: ${loserate}"></div>
          </div>
          <div class="progress-marks">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <!-- Statistics in your existing profile style -->
        <div class="audit-details">
          <p class="profile-row"><strong>Total Audits:</strong> ${total}</p>
          <p class="profile-row"><strong>Success:</strong> ${success}</p>
          <p class="profile-row"><strong>Fail:</strong> ${fail}</p>
          <p class="profile-row"><strong>Succes rate Rate:</strong> ${winrate}</p>
          <p class="profile-row"><strong>Fail rate Rate:</strong> ${loserate}</p>
        </div>
      </div>
    </div>`;
}