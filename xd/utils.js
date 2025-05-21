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
