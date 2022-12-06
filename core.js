

let btnOrder = document.getElementById('order_btn');

btnOrder.onclick = function () {
    let form = document.getElementById('form-order');
    

    const fio = form.fio.value;
    const email = form.email.value;
    const phone = form.phone.value;
    
    const info = {
        fio,
        phone,
        email
    }

    const infoJSON = JSON.stringify(info)
    console.log(infoJSON);
}