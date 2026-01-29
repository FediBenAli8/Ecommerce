registerbtn = document.getElementsByTagName("button")[0]
registerbtn.addEventListener("click",async ()=>{
    fn = document.getElementById("first-name").value
    ln = document.getElementById("last-name").value
    mail = document.getElementById("email").value
    pw = document.getElementById("password").value
    cpw = document.getElementById("confirm-password").value
    tel = document.getElementById("phone").value
    loc = document.getElementById("loc").value
    type = document.getElementById("garden-type").value
    console.log(fn,ln,mail,pw,cpw,tel,loc,type)
    if(pw==cpw){
        console.log("hello")
        res = await fetch("/api/register",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify({
                fn:fn,
                ln:ln,
                mail:mail,
                pw:pw,
                tel:tel,
                loc:loc,
                type:type
            })
        })
        stat = await res.json()
        if(stat.status=="okk"){
            window.location.href = "/"
        }else{
            prompt("email already exists")
        }
    }
})