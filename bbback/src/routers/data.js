const express = require('express');
const mysql = require('mysql');
const router = express.Router();

// mysql연동시 해당 user, password, database 명으로 변경하기
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    databse: 'mydatabase'
});

//router에서 데이터 가져오기
router.get('/', function (req, res) {
    connection.query('SELECT * FROM users', function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    });
});

//연결 종료
connection.end();
