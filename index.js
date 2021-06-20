const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '1234',
    database : 'bcstory'
})

app.get('/create', (req,res) =>
    res.sendFile(path.join(__dirname, 'html/index.html')))

app.get('/', (req,res) => {
    const sql = "SELECT * FROM users";
    con.query(sql, function (err, result, fields) {
        if(err) throw err;
        res.render('index', {users : result});
    })
});



app.get('/edit/:id', (req,res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if(err) throw err;
        res.render('edit', {user : result});
    })
});


app.get('/delete/:id', (req,res) => {
    const sql = "DELETE FROM users WHERE id=?";
    con.query(sql,[req.params.id], function (err, result, fields) {
        if(err) throw err;
        console.log(result);
        res.redirect("/");
    })
});


app.post('/', (req, res) => {
    const sql = "INSERT INTO users SET ?"

    con.query(sql, req.body, function(err, result, field) {
        if (err) throw err;
        console.log(result);
        res.redirect('/')
    })
})

app.post('/update/:id', (req,res) => {
    const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
    con.query(sql, req.body, function (err, result, fields) {
        if(err) throw err;
        res.redirect("/")
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))