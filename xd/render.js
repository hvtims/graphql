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

function ensureGraphHost() {
  let host = document.getElementById('graph')
  if (host) return host
  const container = document.getElementById('audit-root') || document.body
  host = document.createElement('div')
  host.id = 'graph'
  host.style.height = '320px'
  host.style.marginTop = '20px'
  container.appendChild(host)
  return host
}

export function renderGraph(data) {
  const parsed = data.map(d => ({ name: d.object.name, date: new Date(d.createdAt) })).sort((a, b) => a.date - b.date)
  if (!parsed.length) return
  let cum = 0
  const points = parsed.map(p => ({ date: p.date, y: ++cum, name: p.name }))
  const W = 640, H = 320
  const m = { top: 20, right: 20, bottom: 40, left: 50 }
  const xMin = points[0].date
  const xMax = points.at(-1).date
  const yMax = points.at(-1).y
  const x = t => m.left + ((t - xMin) / (xMax - xMin || 1)) * (W - m.left - m.right)
  const y = v => H - m.bottom - (v / yMax) * (H - m.top - m.bottom)
  const host = ensureGraphHost()
  host.innerHTML = ''
  const cs = getComputedStyle(document.documentElement)
  const axisColor = cs.getPropertyValue('--text-secondary').trim() || '#666'
  const accent = cs.getPropertyValue('--accent-primary').trim() || 'steelblue'
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
  svg.setAttribute('width', W)
  svg.setAttribute('height', H)
  host.appendChild(svg)
  const add = (el, attrs) => { Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); svg.appendChild(el) }
  add(document.createElementNS(svgNS, 'line'), { x1: m.left, y1: H - m.bottom, x2: W - m.right, y2: H - m.bottom, stroke: axisColor })
  add(document.createElementNS(svgNS, 'line'), { x1: m.left, y1: H - m.bottom, x2: m.left, y2: m.top, stroke: axisColor })
  for (let v = 1; v <= yMax; v++) {
    const yy = y(v)
    add(document.createElementNS(svgNS, 'line'), { x1: m.left - 4, y1: yy, x2: m.left, y2: yy, stroke: axisColor })
    const txt = document.createElementNS(svgNS, 'text')
    add(txt, { x: m.left - 8, y: yy + 3, 'text-anchor': 'end', 'font-size': '10', fill: axisColor })
    txt.textContent = v
  }
  const fmt = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })
  points.forEach(p => {
    const xx = x(p.date)
    add(document.createElementNS(svgNS, 'line'), { x1: xx, y1: H - m.bottom, x2: xx, y2: H - m.bottom + 4, stroke: axisColor })
    const txt = document.createElementNS(svgNS, 'text')
    add(txt, { x: xx, y: H - m.bottom + 16, 'text-anchor': 'middle', 'font-size': '10', fill: axisColor })
    txt.textContent = fmt.format(p.date)
  })
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.date)},${y(p.y)}`).join(' ')
  add(document.createElementNS(svgNS, 'path'), { d, fill: 'none', stroke: accent, 'stroke-width': 2 })
  points.forEach(p => {
    const c = document.createElementNS(svgNS, 'circle')
    add(c, { cx: x(p.date), cy: y(p.y), r: 3, fill: accent })
    const title = document.createElementNS(svgNS, 'title')
    title.textContent = `${p.y}: ${p.name} (${p.date.toLocaleDateString()})`
    c.appendChild(title)
  })
}
