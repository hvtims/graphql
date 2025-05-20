export function showNotification(message) {
  const el = document.getElementById("custom-notification");
  el.textContent = message;
  el.style.display = "block";
  console.log(localStorage.getItem('jwt'))
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
  renderUserProfile(login , fname , lname , email)
}
function renderUserProfile( login, firstName, lastName, email ) {
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
      </div>
    </div>`
}
