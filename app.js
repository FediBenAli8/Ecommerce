const { render } = require("ejs")
const express = require("express")
const mysql = require("mysql2")
const Cookies = require('cookies');

const app = express()

const PORT = process.env.PORT || 3000;
app.use(Cookies.express());
app.set("view engine", "ejs")
app.set("views", "./views")

app.use(express.json())
app.use(express.static("assets"))
app.use(express.urlencoded({ extended: false }));

const dbConfig = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "changeme",
    database: process.env.DB_NAME || "store"
};

let con = mysql.createConnection(dbConfig);
con.connect(function (err) {
    if (err) {
        console.error("error", err.stack)
    }
    else {
        console.log("Connected!");
    }
});

app.get("/", (req, res) => {
    res.render("welcome")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.post("/api/register", (req, res) => {
    console.log("sql not updated")
    console.log(req.body)
    const { fn, ln, mail, pw, tel, loc, type } = req.body
    con.query(`select * from users where email = '${mail}'`, (err, result, fields) => {
        if (err) throw err;
        console.log(result, "aaa")
        if (result.length == 0) {
            if (mail != "admin@gmail.com") {
                role = "user"
            }
            else { role = "admin" }
            console.log("sql still not updated")
            con.query(`insert into users (firstname,lastname,phone,email,password,loc,role,pref)
                value('${fn}','${ln}','${tel}','${mail}','${pw}','${loc}','${role}','${type}')`, (err, result, fields) => {
                if (err) throw err;
                console.log("sql updated")
                console.log(result)
                res.cookies.set('ID', result.insertId, {
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                    httpOnly: true, // Prevents client-side JS access
                    secure: false, // Only sent over HTTPS
                    sameSite: 'lax' // Prevents CSRF attacks
                });
                res.json({ "status": "okk" })
            }
            )

        } else {
            res.json({ "status": "email" })
        }
    })
})
app.post("/api/addOrder", async (req, res) => {
    const { u, p, q } = req.body
    // 1. Input validation
    r = ""
    console.log(u, p, q)
    if (!u || !p || !q || q <= 0) {
        console.log("err")
    }



    // 2. Check if user and product exist
    con.query(
        "SELECT id FROM users WHERE id = ?",
        [u], (err, result, fields) => {
            if (result.length) {
                con.query(
                    "SELECT id, qte FROM plants WHERE id = ?",
                    [p], (err, result, fields) => {
                        if (result.length) {
                            con.query(
                                "SELECT id FROM orders WHERE productId = ? AND userId = ? ORDER BY id DESC LIMIT 1",
                                [p, u], (err, result, fields) => {
                                    if (err) {
                                        console.error("Query error:", err);
                                        return;
                                    }
                                    console.log("Query result:", result);
                                    if (result.length == 0) {

                                        if (err) {
                                            console.error("Query error:", err);
                                            return;
                                        }
                                        console.log('here0')
                                        con.query("SELECT id as lastId FROM orders ORDER BY id DESC LIMIT 1",
                                             (err, result, fields) => {
                                                if (err) {
                                                    throw err
                                                }
                                                console.log(result)
                                                console.log("here1")
                                                const nextId = result[0] ? result[0].lastId : 1;
                                                con.query(
                                                    "INSERT INTO orders VALUES (?, ?, ?, ?)",
                                                    [nextId, q, p, u]
                                                )
                                            }
                                        )
                                        console.log("here2")
                                        con.query(
                                            "UPDATE plants SET qte = qte - ? WHERE id = ?",
                                            [q, p]
                                        );
                                        r = "okk"
                                    } else {
                                        r = "ordered"
                                        
                                    }
                                }
                            );

                        }
                    }
                );
            }
        }
    );


    res.json({ status: r });

})
app.post("/api/login", (req, res) => {
    console.log(req.body)
    const { email, pw } = req.body
    con.query(`select * from users where email = '${email}' and password = '${pw}' limit 1;`, (err, result, fields) => {
        if (err) throw err;
        console.log(result.length)
        if (result.length == 1) {
            res.cookies.set("ID", result[0].id)
            res.json({ "status": "ok" })
        } else {
            res.cookies.set("ID", null)
            res.json({ "status": "" })
            console.log("error")
        }
    })
})
app.get("/api/connected", (req, res) => {
    id = req.cookies.get("ID")
    res.json({ "id": id })
})
app.get("/admin", (req, res) => {
    res.render("admin")
})
app.get("/error", (req, res) => {
    res.render("error")
})
app.post("/logout", (req, res) => {
    res.cookies.set("ID", null)
    console.log("logout")
    res.json({ "stat": "nice" })
    //res.render("welcome")
})
app.post("/api/addP", (req, res) => {
    let stat;
    const { pn, cat, p, qte, desc, url } = req.body
    con.query(`insert into plants(name,cat,price,qte,label,img) value('${pn}','${cat}',${p},${qte},'${desc}','${url}')`, (err, result, fields) => {
        console.log(result.affectedRows)
        if (result.affectedRows == 1) {
            stat = "okk"
        } else {
            stat = ""
        }
    })
    res.json({ "stat": stat })

})
app.get("/products", (req, res) => {
    res.render("products")
})
app.post("/api/getProducts", (req, res) => {
    cat = req.body.Cat
    if (cat == "") {
        sqlCmd = "select * from plants"
    } else {
        sqlCmd = `select * from plants where cat = ${cat}`
    }
    con.query(sqlCmd, (err, result, fields) => {
        if (err) throw err;
        res.json({ "list": result })
    })
})
app.get("/cart",(req,res)=>{
    res.render("cart")
})
app.post("/api/updateCart",(req,res)=>{
    const{newQte,id} = req.body
    uid = req.cookies.get("ID")
    con.query("update orders set qte = ? where id = (select id from orders where userId = ? and productId = ?)",[newQte,uid,id],(err,result)=>{
        if(err){
            throw err
        }else{
            res.json({stat:"nice"})
        }
    })
})
app.get("/api/getcart",(req,res)=>{
    id = req.cookies.get("ID")
    console.log(id)
    con.query("select p.*,o.oqte from plants p inner join orders o on p.id = o.productId where o.userId = ? and o.id = (select id from orders where id = ? order by id desc limit 1)",
        [id,id],(err,result,field)=>{
            if (err) throw err
            console.log(result)
            res.json({"data":result})
        }
    )
})
app.post("/api/placeOrder", (req, res) => {
    const id = req.body.id;
    
    // First query to get the latest order ID
    con.query("SELECT id AS id FROM orders WHERE userId = ? ORDER BY id DESC LIMIT 1", [id], (err, result, fields) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({"stat": "database error"});
        }
        
        if (!result || result.length === 0) {
            return res.status(404).json({"stat": "no orders found"});
        }
        
        const oid = result[0].id;
        console.log(oid);
        
        // Second query to insert status
        con.query("INSERT INTO stat(orderId, stat) VALUES(?, ?)", [oid, 'placed'], (err, result, fields) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({"stat": "database error"});
            }
            console.log(result.insertId)
            if (result.insertId>=0) {
                console.log("hello");
                res.json({"stat": "okk"});
            } else {
                res.status(500).json({"stat": "insert failed"});
            }
        });
    });
});
app.get("/product",(req,res)=>{
    res.render("product")
})
app.get("/admin/orders",(req,res)=>{
    res.render("orders")
})
app.get("/api/getOrders",(req,res)=>{
    con.query("select * from orders inner join stat on orders.id = stat.orderId inner join plants on plants.id = orders.productId where stat in('placed','Processing','done')",(err,result)=>{
        if (err) throw err
        console.log(result)
        res.json({orders:result})
    })
})
app.listen(PORT, () => {
    console.log("listening on port 3000 : http://localhost:3000/");
})
