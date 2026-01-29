const temp = document.getElementsByClassName("order-card")[0].cloneNode(true)
const item_temp = temp.getElementsByClassName("order-item")[0].cloneNode(true)
temp.getElementsByClassName("order-item")[0].remove()
document.getElementsByClassName("order-card")[0].remove()

document.addEventListener("DOMContentLoaded",async()=>{
    let res = await fetch("/api/getOrders")
    let result = await res.json()
    console.log(result.orders)
    ords = result.orders.sort()
    c = 1;
    test = true
    for(i = 0;i<ords.length;i++){
        card = temp.cloneNode(true)
        card.getElementsByClassName("order-number")[0].innerHTML = `Order #${c}`
        for(j = 0;j<ords.length;j++){
            test = false
            itemC = item_temp.cloneNode(true)
            console.log(ords[j].orderId==c)
            if(ords[j].orderId==c){
                console.log(ords[j].img)
                itemC.getElementsByTagName("img")[0].src = ords[j].img
                test = true
                itemC.getElementsByClassName("item-name")[0].innerHTML = ords[j].name
                itemC.getElementsByClassName("item-price")[0].innerHTML = `${ords[j].price} x ${ords[j].oqte}`
            }
            if(test){
                card.getElementsByClassName("order-items")[0].appendChild(itemC)
                document.getElementsByClassName("orders-container")[0].appendChild(card)
            }
        }
        c++
    }
})

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        const filter = this.textContent.toLowerCase();
        // In a real app, you would filter orders here
        console.log('Filtering by:', filter);
    });
});
document.getElementsByClassName("back-link")[0].addEventListener("click",()=>{
    window.location.href = "/admin"
})
// View Details functionality
document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const orderNumber = this.closest('.order-card').querySelector('.order-number').textContent;
        alert(`Viewing details for: ${orderNumber}`);
        // In a real app, you would navigate to order details page
    });
});

// Cancel Order functionality
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const orderNumber = this.closest('.order-card').querySelector('.order-number').textContent;
        if (confirm(`Are you sure you want to cancel ${orderNumber}?`)) {
            fetch("/api/deleteOrder",{
                
            })
            // In a real app, you would make an API call to cancel the order
        }
    });
});

// Track Order functionality
document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const orderNumber = this.closest('.order-card').querySelector('.order-number').textContent;
        alert(`Tracking order: ${orderNumber}`);
        // In a real app, you would show tracking information
    });
});