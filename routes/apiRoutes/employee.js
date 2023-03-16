const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/employee', (req, res) => {
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
router.get('/employee/:id', (req, res) => {
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
router.delete('/employee/:id', (req,res) => {
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
router.post('/employee', ({ body }, res) => {
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

module.exports = router;