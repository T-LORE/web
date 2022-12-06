const domain = 'http://localhost:3000'

window.onload = function(){
    document.body.scrollTop = 0;
}

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

    // const infoJSON = JSON.stringify(info)



    // console.log(infoJSON);

    fetch('http://localhost:3000').then(function(response){
        if (response.ok) {
            return response.text()
        } 
    }).then(function(text) {
        console.log(text)
    })
}