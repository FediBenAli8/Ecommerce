nav = document.getElementsByTagName("ul")[0]
btns = nav.getElementsByTagName("li")
btns[1].addEventListener("click",()=>{
    window.location.href = "/products"
})
btns[7].addEventListener("click",()=>{
    window.location.href = "/cart"
    console.log("uvyu")
})
document.addEventListener("DOMContentLoaded",async()=>{
    console.log("loaded")
    res = await fetch("/api/connected",{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        }
    })
    stat = await res.json()
    console.log(stat.id)
    if(Number(stat.id)==1){
        admin = document.createElement("li")
        a = document.createElement("a")
        a.innerHTML = "Admin"
        admin.appendChild(a)
        admin.addEventListener("click",()=>{
            window.location.href = "/admin"
        })
        nav.appendChild(admin)
        btns[6].innerHTML = "<li><a>logout<a/></li>"
    }
    else if(Number(stat.id)>1){
        btns[6].innerHTML = "<li><a>logout<a/></li>"
    }else{
        btns[6].innerHTML = "<li><a>Login<a/></li>"
    }
    console.log(stat.id)
})

btns[6].addEventListener("click",async()=>{
    console.log(btns[6].textContent)
    if(btns[6].textContent=="Login"){
        window.location.href = "/login"
    }
    else{
        window.location.href = "/logout"
        res = await fetch("/logout",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials: "include"
        })
        stat = await res.json()
        console.log(stat.stat)
        window.location.reload()
    }
})