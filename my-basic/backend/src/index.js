const express = require("express");
const {Pool} = require("pg");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"regdata",
    password:"root",
    port:5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post("/register",async(req,res) =>{
    console.log("*",req.body)
    const {fname,lname,email,password,dob,phone,countries} = req.body;
    // const countryArr = countries.map(country => country.name);
    const query = `INSERT INTO users(f_name,l_name,email,password,dob,phone,countries)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    RETURNING id;
    `;

    try{
        const {rows} = await pool.query(query,[
            fname,
            lname,
            email,
            password,
            dob,
            phone,
            countries
        ]);
        console.log("response",rows)
        res.status(201).json(rows);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error saving user data to the db"});
    }
});



app.get("/register",async(req,res) =>{
    const query = `SELECT * FROM users;
    `;

    try{
        const {rows} = await pool.query(query);
        res.status(200).json(rows);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error while fetching data from users"});
    }
});


app.put("/register/:id",async(req,res)=>{
    const {id} = req.params;
    const {fname,lname,email,password,dob,phone,countries} = req.body;

    const query = `UPDATE users SET f_name = $1, l_name = $2,email = $3, password = $4, dob = $5,phone = $6,countries = $7,
    WHERE id = $8
    RETURNING *;
    `;



    try {
        const {rows} = await pool.query(query,[
            fname,lname,email,password,dob,phone,countries,id
        ]);

        if(rows.length===0){
            return res.status(404).json({error:"User not found"});
        }
        res.status(200).json(rows[0]);
    }
    catch(error){
        console.error(error);
        res.status(500).json({error:"Error while updating user data"});
    }
});


app.delete("/register/:id",async(req,res) =>{
    const {id} = req.params;
    const query = `DELETE FROM USERS WHERE id = $1 RETURNING *;
    `;

    try{
        const {rows} = await pool.query(query,[id]);
        if(rows.length === 0){
            return res.status(404).json({error:"users not found"});
        }
        res.status(200).json({message:"User deleted successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: "Error deleting user data" });
    }
});

app.listen(port,() =>[
    console.log(`Server running in port ${port}`)
]);