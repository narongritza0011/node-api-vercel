const express = require('express')
const mysql = require('mysql')


const app = express()

app.use(express.json())


//Mysql Connection
const Connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysql_nodejs'
})


Connection.connect((err) => {
    if (err) {
        console.log('Error connectiong to Mysql database = ', err)
        return
    }
    console.log('Mysql successfully connected!')
})





//Create Routes
app.get('/', (req, res) => {
    res.send('API is running')
})


///create user
app.post("/create", async(req, res) => {
    const { email, name, password } = req.body

    try {
        Connection.query(
            "INSERT INTO users(email,fullname,password) VALUES(?,?,?)", [email, name, password],
            (err, results, fields) => {
                if (err) {
                    console.log('Error while inserting a user into the database', err)
                    return res.status(400).send()
                }
                return res.status(201).json({ mesage: "New user successfully created" })
            }
        )
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})


//Get all users
app.get("/users",
    async(req, res) => {
        try {
            Connection.query("SELECT * FROM users", (err, results, fields) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                res.status(200).json(results)
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send()
        }
    })



//Get single User from Db
app.get("/users/:id",
    async(req, res) => {
        const id = req.params.id
        try {
            Connection.query("SELECT * FROM users WHERE id = ?", [id], (err, results, fields) => {
                if (err) {
                    console.log(err)
                    return res.status(400).send()
                }
                res.status(200).json(results)
            })
        } catch (err) {
            console.log(err)
            return res.status(500).send()
        }
    })



//Update data user
app.put("/update/:id", async(req, res) => {
    const id = req.params.id
    const newPassword = req.body.newPassword;
    try {
        Connection.query("UPDATE users SET password = ? WHERE id = ?", [newPassword, id], (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send()
            }
            res.status(200).json({ mesage: "User password updated successfully" })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})



//delete data user
app.delete("/delete/:id", async(req, res) => {
    const id = req.params.id
    try {
        Connection.query("DELETE FROM users  WHERE id = ?", [id], (err, results, fields) => {
            if (err) {
                console.log(err)
                return res.status(400).send()
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "No user with that email!"
                })
            }
            return res.status(200).json({
                message: "User deleted successfully"
            })
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send()
    }
})


app.listen(4000, () => console.log('Server is running on port 3000'))