export function showNotification(message) {
  const el = document.getElementById("custom-notification");
  el.textContent = message;
  el.style.display = "block";
  setTimeout(() => {
    el.style.display = "none";
  }, 3000);
}
export async function Getcredontial (){
  const query_data = `
    {
  user{
    login
    lastName
    firstName
    email
    campus
    attrs
  } 
    transaction_aggregate(
            where: {
                type: { _eq: "xp" }
                event: { object: { name: { _eq: "Module" } } }
            }
        ) {
        aggregate {
            sum {
                amount
            }
        }
        }
}
  `
  const jwt = localStorage.getItem("jwt")
  const response  = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql',{

      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${jwt}`
      },
      body : JSON.stringify({query : query_data})

  })
  const tki = await response.json()
  const login = tki.data.user[0].login
  const email = tki.data.user[0].email
  const fname = tki.data.user[0].firstName
  const lname = tki.data.user[0].lastName  
  const rawamount = tki.data.transaction_aggregate.aggregate.sum.amount;
  let amount = (rawamount/1000).toFixed(0) + "kB"
  const campus = tki.data.user[0].campus
  const region = tki.data.user[0].attrs.addressRegion  
  renderUserProfile(login , fname , lname , email ,amount , campus,region)
}
function renderUserProfile( login, firstName, lastName, email , xp , campus , region) {
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
export async function Getauditdata() {
  const audit_query = `
    {
  user {
    audits {   
      grade
  }
}
}
  `
  const jwt = localStorage.getItem("jwt")
  const response  = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql',{

      method : "POST",
      headers : {
        "Content-Type" : "application/json",
        "Authorization" : `Bearer ${jwt}`
      },
      body : JSON.stringify({query : audit_query})

  })
  const tki = await response.json()
  const tottal_filtered_audits = tki.data.user[0].audits.filter(audit => audit.grade !== null);
  let succes = 0
  let fail = 0  
  tottal_filtered_audits.forEach(e => {   
    if (e.grade >= 1 ){
      succes++
    }else{
      fail++
    }
  });
  const winrate = ((succes / tottal_filtered_audits.length)*100).toFixed(1) + "%"
  const loserate  = ((fail /tottal_filtered_audits.length)*100).toFixed(1) + "%"
  const total_audits = tottal_filtered_audits.length
  // console.log(total_audits);
  renderAuditData(total_audits, succes, fail, winrate, loserate)

  // console.log(winrate);
  // console.log(loserate);
}
function renderAuditData(total, success, fail, winrate, loserate) {
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