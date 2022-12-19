const domain = 'http://localhost:3000'

window.onload = function(){
    document.body.scrollTop = 0;
}

/* Скролл в начачло страницы при обновлении */
document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
document.body.scrollTop = 0; // For Safari

let btnOrder = document.getElementById('order_btn');

btnOrder.onclick = async function () {
    let form = document.getElementById('form-order');
    

    const fio = form.fio.value;
    const email = form.email.value;
    const phone = form.phone.value;
    
    const response = await fetch(`${domain}/api/info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fio: fio,
          email: email,
          phone: phone
        })
      })

      if (response.ok){
        document.getElementsByClassName('popup-sent-status-data')[0].style.color = `green`
        document.getElementsByClassName('popup-sent-status-data')[0].style.opacity = `0`
        
           
    
        document.getElementsByClassName('popup-sent-status-data')[0].innerHTML = `<div class = "popup-sent-status-data">Ваша заявка отправленна!</div>`
        
        let start = Date.now();
        let timer = setInterval(function() {
        let timePassed = Date.now() - start;   
        if (timePassed >= 200) {
          clearInterval(timer); 
          return;
        } 
        document.getElementsByClassName('popup-sent-status-data')[0].style.opacity = `${timePassed/200}`;
      }, 20); 
      } else {
        document.getElementsByClassName('popup-sent-status-data')[0].style.color = `red`
        document.getElementsByClassName('popup-sent-status-data')[0].style.opacity = `0`
        const errors = await response.json()
        let errorsStrings = ""
        for(let i = 0; i < errors.message.length;i++){
          errorsStrings+=`<div class = "popup-sent-status-data">${errors.message[i]}</div>`; 
        }
        document.getElementsByClassName('popup-sent-status-data')[0].innerHTML = errorsStrings 
        
        let start = Date.now();
        let timer = setInterval(function() {
        let timePassed = Date.now() - start;   
        if (timePassed >= 200) {
          clearInterval(timer); 
          return;
        } 
        document.getElementsByClassName('popup-sent-status-data')[0].style.opacity = `${timePassed/200}`;
      }, 20);
      
      }

    fetch('http://localhost:3000').then(function(response){
        if (response.ok) {
            return response.text()
        } 
    }).then(function(text) {
        console.log(text)
    })
}