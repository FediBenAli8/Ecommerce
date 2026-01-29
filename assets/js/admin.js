document.addEventListener("DOMContentLoaded", async () => {
    res = await fetch("/api/connected", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
    stat = await res.json()
    if (stat.id != 1 || isNaN(stat.id)) {
        window.location.href = "/error"
    }
})
document.getElementsByClassName("menu-item")[3].addEventListener("click",()=>{
    window.location.href = "/admin/orders"
})
// Modal functionality
const modal = document.getElementById('plantModal');
const addPlantBtn = document.getElementById('addPlantBtn');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const addBtn = document.getElementById("addP");
addPlantBtn.addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add New Plant';
    document.getElementById('plantForm').reset();
    modal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
addBtn.addEventListener("click", async() => {
    pn = document.getElementById("plantName").value
    cat = document.getElementById("plantCategory").value
    p = document.getElementById("plantPrice").value
    qte = document.getElementById("plantStock").value
    desc = document.getElementById("plantDescription").value
    console.log(window.uploadedImg);
    url = window.uploadedImg
    console.log(pn,cat,p,qte,desc,window.uploadedImg)
    res = await fetch("/api/addP",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            pn:pn,
            cat:cat,
            p:p,
            qte:qte,
            desc:desc,
            url:url
        })
    })
    stat = await res.json()
    if(stat.stat=="okk"){
        alert("added successufully")
    }else{
        alert("failed to add")
    }

})
