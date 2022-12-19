const root = document.getElementById('root')
const domain = 'http://localhost:3000'

const loginPage = /* html */`
<form class="login-form" onsubmit="loginSubmit(event)">
  <div>
    <label for="login" class="form-label">Login</label>
    <input type="text" class="form-control" id="login" aria-describedby="loginHelp" name="login">
    
  </div>
  <div>
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control password" id="password" name="password">
    <div id="incorrect-login" class="incorrect-text">Incorrect login or password</div>
  </div>
  <button type="submit" class="btn btn-primary btn-login">Login</button>
</form>`

//root.innerHTML = loginPage
function logout(){
  localStorage.setItem('Token', '')
  location.reload();
}

async function deleteFromDb(id){
 
  
  
  console.log(id)
  const response = await fetch(`${domain}/api/deleteinfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      id: id
    })
    
  })
  if (response.ok) {
    renderOrders()
  }
}
function ordersPage(orders = []) {
    return /* html */`
      <div>
      <button onclick="logout()" class="btn btn-primary btn-logout">Logout</button>
      </div>
      <table class="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">FIO</th>
          <th scope="col">Phone</th>
          <th scope="col">Email</th>
          <th scope="col" ></th>
          
        </tr>
      </thead>
      <tbody>
        ${orders.map((order) => {
          return /* html */`
          <tr>
            <th scope="row" name="id">${order.id}</th>
            <td>${order.fio}</td>
            <td>${order.phone}</td>
            <td>${order.email}</td>
            <td onclick='deleteFromDb(${order.id})' class='btn btn-primary btn-delete'>delete</td>
            
          </tr>
          `
        }).join('')}
      </tbody>
      </table>
    `
  } 

  async function loginSubmit(event) {
    event.preventDefault()
    
    const form = event.target
    const loginValue = form.login.value;
    const passwordValue = form.password.value;
    console.log(loginValue)
    const response = await fetch(`${domain}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        name: loginValue,
        password: passwordValue
      })

    })

    if (response.ok) {
      const tokenInfo = await response.json()
      localStorage.setItem('Token', tokenInfo.token)
      renderOrders()
    } else {
      
      let start = Date.now();
      let timer = setInterval(function() {
        let timePassed = Date.now() - start;   
        if (timePassed >= 200) {
          clearInterval(timer); 
          return;
        } 
        document.getElementsByClassName('incorrect-text')[0].style.opacity = `${timePassed/200}`;
      }, 20);
    document.getElementsByClassName('password')[0].value = '';
    }
  }
  
  async function renderOrders() {
    const token = localStorage.getItem('Token')
    if (token) {
      const response = await fetch(`${domain}/api/info`, {
        headers: {
          'Authorization': token
        }
      })
      if (response.ok) {
        const orders = await response.json()
        const ordersHtml = ordersPage(orders)
        root.innerHTML = ordersHtml
      } else {
        root.innerHTML = loginPage
      }
    } else {
      root.innerHTML = loginPage
    }
  }
  
  renderOrders()
