cards = document.getElementsByClassName("product-card")
card_temp = cards[0].cloneNode(true)
grid = document.getElementsByClassName("products-grid")[0]
var len = cards.length;
m = document.getElementsByClassName("modal-overlay")[0]
console.log(m)
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const decreaseQty = document.getElementById('decreaseQty');
const increaseQty = document.getElementById('increaseQty');
const quantityInput = document.getElementById('quantityInput');
const addToCartBtn = document.getElementById('addToCartBtn');
function closeModalFunc() {
    modalOverlay.classList.remove('active');
}

closeModal.addEventListener('click', closeModalFunc);
cancelBtn.addEventListener('click', closeModalFunc);

// Close when clicking outside modal
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        closeModalFunc();
    }
});

// Quantity controls
decreaseQty.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
        quantityInput.value = value - 1;
    }
});

increaseQty.addEventListener('click', () => {
    let value = parseInt(quantityInput.value);
    if (value < 10) { // 10 is the max quantity
        quantityInput.value = value + 1;
    }
});
console.log(m)
for (let i = 0; i < len; i++) {
    cards[i].remove()
    len--;
    i--;
}
const fetchData = async (cat = "") => {
    console.log(cat)
    res = await fetch("/api/getProducts", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Cat: cat
        })
    })
    products = await res.json()
    return products.list

}
const sendOrder = async(pid,uid,qte)=>{
    let res = await fetch("/api/addOrder",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            u:uid,
            p:pid,
            q:qte
        })
    })
    stat = await res.json()
    console.log(stat)
    if(stat.status=="okk"){
        alert("added to orders")
    }else if(stat.status=="ordered"){
        alert("this plants is already in the cart")
    }else{
        alert("didn't add to orders")
    }
}
const showProducts = (prds) => {
    for (prd of prds) {
        card = card_temp.cloneNode(true)
        console.log(prd)
        console.log(card)
        console.log(card.getElementsByTagName("img")[0])
        card.getElementsByTagName("img")[0].src = prd.img
        console.log(card.getElementsByTagName("img")[0])
        card.getElementsByClassName("product-category")[0].innerHTML = prd.cat
        card.getElementsByClassName("product-title")[0].innerHTML = prd.name
        card.getElementsByClassName("id")[0].innerHTML = prd.id
        card.getElementsByClassName("product-description")[0].innerHTML = prd.label
        card.getElementsByClassName("product-price")[0].innerHTML = `${prd.price} dt`
        card.querySelector("button").id = "omok-"+prd.id;
        console.log(card.getElementsByTagName("button"))
        btn = card.querySelector("#omok-"+prd.id);
        console.log(btn);
        btn.addEventListener("click", async(e) => {
            plant = card
            prd = Object.values(prds).filter(p => p.id == e.target.id.split("-")[1])[0];
            console.log("33333333333",prd)
            // console.log(plant)
            res = await fetch("/api/connected",{
                method:"GET",
                headers:{
                    "Content-Type":"application/json"
                }
            })
            result = await res.json()

            if (result.id) {
                console.log(prd, prds)
                info = m.getElementsByClassName("product-info")[0]
                info.getElementsByTagName("img")[0].src = prd.img

                detail = m.getElementsByClassName("product-details")[0]
                detail.getElementsByClassName("product-name")[0].innerHTML = prd.name
                detail.getElementsByClassName("product-category")[0].innerHTML = prd.cat
                detail.getElementsByClassName("product-price")[0].innerHTML = `${prd.price} dt`
                m.classList.add('active');
                console.log()
                addToCartBtn.addEventListener('click', () => {
                    const productName = card.querySelector('.id').textContent;
                    const quantity = quantityInput.value;
                    console.log(productName)
                    sendOrder(productName,result.id,quantity)
                })
            }else{
                alert("plz log in")
            }

        })
        grid.appendChild(card)
    }
}
window.addEventListener("DOMContentLoaded", async () => {
    products = await fetchData()
    showProducts(products)

})