import { renderUserProfile } from "./render.js";
import  { renderAuditData } from "./render.js";
import { renderGraph } from "./render.js";
//--------------------- DATA QUERY
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
//---------------------- AUDIT QUERY
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
  Getgraphdata()
  renderAuditData(total_audits, succes, fail, winrate, loserate)
}

export async function Getgraphdata(){
    const graph_query = `
      {
  pro: progress(where:{eventId : {_eq : 41},object:{type:{_eq : "project"}}}){
    object {
      name
    }
    isDone
    createdAt
  }
}
    `
    const jwt = localStorage.getItem('jwt')
    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql',{
        method : "POST",
        headers :{
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${jwt}`
        },
        body : JSON.stringify({query : graph_query})
    })
    const tki = await response.json()
   
    
    // console.log(tki.data[0].pro[0].isDone)
    const seen = {}
    const uniqueProjects = []
    for (let i = 0; i < tki.data.pro.length; i++) {
        const item = tki.data.pro[i]    
        const name = item.object.name
         const istrue = tki.data.pro[i].isDone 
        if ((!seen[name]) && (istrue == true))  {
            seen[name] = true
            uniqueProjects.push(item)
        }
    }
    renderGraph(uniqueProjects)
    
  }