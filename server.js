const express = require('express');
// const db = require('./db/connection');
const start = require('.');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

// express.js middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const mysql = require('mysql2');

// connect app to MySQL database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MySQL username, 'root' is default user
        user: 'root',
        // your MySQL password
        password: 'Workhappy2023$',
        database: 'company'
    },
    console.log(`Connected to the company database`)
);

// Start server after DB connection
// db.connect(err => {
//     if (err) throw err;
//     // run function to start prompts after db connection
//     start;
// });
// db.query(`SELECT * FROM employee WHERE id = 1`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });
// db.query(`SELECT * FROM employee WHERE id = 2`, (err, row) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(row);
// });
// db.query(`DELETE FROM employee WHERE id = ?` (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// GET all employees(how to create get route, creating api end points to get all the employees)
app.get('/api/employee', (req, res) => {
    const sql = `SELECT * FROM employee`;

    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
});
});

// GET A SINGLE EMPLOYEE
app.get('/api/employee/:id', (req, res) => {
    const sql = `SELECT * FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});
// DELETE A EMPLOYEE
app.delete('/api/employee/:id', (req,res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql,params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error:res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Employee not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});
// create a employee
app.post('/api/employee', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates ('first_name', 'last_name', 'role_id', 'manager_id')
  VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

db.query(sql, params, (err, result) => {
  if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  res.json({
    message: 'success',
    data: body
  });
});
});


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});