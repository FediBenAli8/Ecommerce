
template = document.getElementsByClassName("cart-item")[0].cloneNode(true)
document.getElementsByClassName("cart-item")[0].remove()
list = document.getElementsByClassName("cart-items")[0]
document.addEventListener("DOMContentLoaded",async()=>{
    res = await fetch("/api/getcart",{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    list = await res.json()
    for(let i = 0;i<list.data.length;i++){
        element = template.cloneNode(true)
        element.getElementsByClassName("id") = list.data[i].id
        element.getElementsByTagName("img")[0].src = list.data[i].img
        element.getElementsByTagName("h3")[0].innerHTML = list.data[i].name
        element.getElementsByClassName("cat")[0].innerHTML = list.data[i].cat
        element.getElementsByClassName("price")[0].innerHTML = list.data[i].price + " dt"
        element.getElementsByClassName("quantity-input")[0].innerHTML = list.data[i].qte
        element.getElementsByClassName("subtotal")[0].innerHTML = list.data[i].qte * list.data[i].price + " dt"
        document.getElementsByClassName("cart-items")[0].appendChild(element)
    }
    updateCartTotal()
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            let value = parseInt(input.value);
    
            if (this.classList.contains('minus-btn') && value > 1) {
                input.value = value - 1;
            } else if (this.classList.contains('plus-btn') && value < 10) {
                input.value = value + 1;
            }
    
            updateSubtotal(this.closest('.cart-item'));
            updateCartTotal();
        });
    });
    
    // Quantity Input Validation
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
            }
            updateSubtotal(this.closest('.cart-item'));
            updateCartTotal();
        });
    });
    
    // Remove Item Functionality
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this item?')) {
                this.closest('.cart-item').remove();
                updateCartTotal();
                // In a real app, you would make an API call to remove from backend
                
                // Show empty cart message if no items left
                if (document.querySelectorAll('.cart-item').length === 0) {
                    // Show empty cart message
                }
            }
        });
    });
    
    // Edit/Save Functionality
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', async() =>{
            const item = this.closest('.cart-item');
            const newQty = item.querySelector('.quantity-input').value;
            let id = item.getElementsByClassName("id").value
            let res = await fetch("/api/updateCart",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:{
                    newQte:newQty,
                    id:id
                }
            })
            let result = await res.json()
            // In a real app, you would make an API call to update quantity
            if(result.stat=="nice"){
                alert(`Quantity updated to ${newQty}`);
            }
            else{
                alert(`failed to update`);
            }
            
            // Visual feedback
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-save"></i>';
            }, 1000);
            
            updateSubtotal(item);
            updateCartTotal();
        });
    });
    
    // Update Subtotal for Single Item
    function updateSubtotal(item) {
        const price = parseFloat(item.querySelector('.price').textContent.replace('$', ''));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        const subtotal = item.querySelector('.subtotal');
        subtotal.textContent = '$' + (price * quantity).toFixed(2);
    }
    
    // Update Cart Total
    function updateCartTotal() {
        let subtotal = 0;
        document.querySelectorAll('.subtotal').forEach(item => {
            console.log(item)
            subtotal += parseFloat(item.textContent.replace('$', ''));
            console.log(subtotal.toFixed(2))
        });
    
        const tax = subtotal * 0.08; // Example 8% tax
        const total = subtotal + tax;
        console.log(document.getElementsByClassName('summary-row')[0].getElementsByTagName("span")[1])
        document.getElementsByClassName('summary-row')[0].getElementsByTagName("span")[1].textContent = '$' + subtotal.toFixed(2);
        document.getElementsByClassName('summary-row')[2].getElementsByTagName("span")[1].textContent = '$' + tax.toFixed(2);
        document.getElementsByClassName('summary-row')[3].getElementsByTagName("span")[1].textContent = '$' + total.toFixed(2);
    }
    
    // Checkout Button
    document.querySelector('.checkout-btn').addEventListener('click', async() =>{
        // In a real app, you would redirect to checkout
        let idRes = await fetch("/api/connected",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        })
        id = await idRes.json()
        let res = await fetch("/api/placeOrder",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }, 
            body:JSON.stringify({
                id:id
            })
        })
        result = await res.json()
        console.log(result.stat)
        if(result.stat){

            alert('Proceeding to checkout!');
        }else{
            alert('there is a problem');
        }

        // window.location.href = '/checkout';
    });
})
document.getElementsByClassName("continue-shopping")[0].addEventListener("click",()=>{
    window.location.href = "/products"
})
