registerbtn = document.getElementsByClassName("register")[0]
Loginbtn = document.getElementsByClassName("btn")[0]
registerbtn.addEventListener("click",()=>{
    window.location.href = "/register"
})
Loginbtn.addEventListener("click",async()=>{
    pw = document.getElementById("password").value
    email = document.getElementById("email").value
    console.log(pw,email)
    res = await fetch("/api/login",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email:email,
            pw:pw
        })
    })
    stat =await res.json()
    if(stat.status){
        window.location.href = "/"
    }else{
        window.location.href = "/error"
        console.log("error")
    }
})