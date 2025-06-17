import { showNotification } from "./utils.js";

export function renderUserProfile(login, firstName, lastName, email, xp, campus, region, profileImage) {
  const root = document.getElementById('profile-root');
  if (!root) return;

  root.innerHTML = `
     <section class="profile-page-container" style="position: relative;">
    <button 
      id="logoutBtn" 
      style="position: absolute; top: 20px; right: 20px; padding: 8px 16px; background-color: #7b1fa2; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Log Out
    </button>

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
        <div class="profile-row"><strong>Login:</strong><span>${login}</span></div>
        <div class="profile-row"><strong>First Name:</strong><span>${firstName}</span></div>
        <div class="profile-row"><strong>Last Name:</strong><span>${lastName}</span></div>
        <div class="profile-row"><strong>Email:</strong><span>${email}</span></div>
        <div class="profile-row"><strong>Campus:</strong><span>${campus}</span></div>
        <div class="profile-row"><strong>XP:</strong><span class="xp-value">${xp}</span></div>
        <div class="profile-row"><strong>Region:</strong><span>${region}</span></div>
      </div>
    </article>
  </section>
`;
  document.getElementById('logoutBtn').addEventListener('click' , () =>{
        localStorage.removeItem('jwt')
      showNotification("logged out")
        location.reload()
  })

}

export function renderAuditData(total, success, fail, winrate, loserate) {
  const root = document.getElementById('audit-root');
  if (!root) return;
  
  root.innerHTML = `
    <div class="stats-container">
      <div class="stats-card">
        <h2>Audit Statistics</h2>
        <div class="win-rate-display">${winrate} Success Rate</div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="win-progress" style="width: ${winrate}"></div>
            <div class="lose-progress" style="width: ${loserate}"></div>
          </div>
          <div class="progress-labels">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${total}</div>
            <div class="stat-label">Total Audits</div>
          </div>
          <div class="stat-item success">
            <div class="stat-value">${success}</div>
            <div class="stat-label">Success</div>
          </div>
          <div class="stat-item fail">
            <div class="stat-value">${fail}</div>
            <div class="stat-label">Failed</div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderSkillData(skills) {
  const root = document.getElementById('skill-root');
  if (!root) return;

  // Deduplicate by keeping the highest amount for each type
  const map = new Map();
  for (const skill of skills) {
    if (!map.has(skill.type) || map.get(skill.type).amount < skill.amount) {
      map.set(skill.type, skill);
    }
  }

  const cleanedSkills = Array.from(map.values());
  const maxAmount = Math.max(...cleanedSkills.map(s => s.amount));

  // Responsive sizing calculations
  const isMobile = window.innerWidth < 768;
  const barWidth = isMobile ? 50 : 90;
  const barSpacing = isMobile ? 20 : 40;
  const baseChartHeight = isMobile ? 350 : 600;
  const chartHeight = Math.min(baseChartHeight, window.innerHeight * 0.5);
  const chartWidth = cleanedSkills.length * (barWidth + barSpacing);

  // Calculate dynamic font sizes
  const amountFontSize = isMobile ? 16 : 22;
  const labelFontSize = isMobile ? 14 : 18;

  const svgBars = cleanedSkills.map((skill, i) => {
    const height = (skill.amount / maxAmount) * chartHeight;
    const x = i * (barWidth + barSpacing);
    const y = chartHeight - height;

    return `
      <g class="skill-group">
        <!-- Bar with shadow -->
        <rect 
          x="${x}" 
          y="${y}" 
          width="${barWidth}" 
          height="${height}" 
          rx="8" 
          fill="url(#barGradient)" 
          class="skill-bar"
          filter="url(#barShadow)"
        />

        <!-- Amount Label Above -->
        <text 
          x="${x + barWidth / 2}" 
          y="${y - 15}" 
          text-anchor="middle" 
          font-size="${amountFontSize}" 
          fill="var(--text-primary)"
          font-weight="600"
          class="skill-amount"
        >
          ${skill.amount}
        </text>

        <!-- Skill Label Below -->
        <text 
          x="${x + barWidth / 2}" 
          y="${chartHeight + 35}" 
          text-anchor="middle" 
          font-size="${labelFontSize}" 
          fill="var(--text-primary)"
          class="skill-label"
        >
          ${skill.type.replace('skill_', '').toUpperCase()}
        </text>
      </g>
    `;
  }).join('');

  root.innerHTML = `
    <div class="stats-container">
      <div class="stats-card">
        <h2>Skill Stats</h2>
        <div class="chart-container">
          <svg
            viewBox="0 0 ${chartWidth} ${chartHeight + 80}"
            width="100%"
            height="${chartHeight + 80}"
            preserveAspectRatio="xMinYMin meet"
            xmlns="http://www.w3.org/2000/svg"
            font-family="Segoe UI, Tahoma, sans-serif"
            class="skill-chart"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" x2="0" y1="1" y2="0">
                <stop offset="0%" stop-color="var(--accent-primary)" />
                <stop offset="100%" stop-color="var(--accent-secondary)" />
              </linearGradient>
              <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            ${svgBars}
          </svg>
        </div>
      </div>
    </div>
  `;

  // Add resize listener for better responsiveness
  const resizeHandler = () => renderSkillData(skills);
  window.addEventListener('resize', resizeHandler);
  
  // Clean up listener when component unmounts
  return () => window.removeEventListener('resize', resizeHandler);
}