const express = require("express");
const router = express.Router();
const { Graph } = require("../db/models/model");

router.get('/', (req, res) => {
    res.send('data');
})

module.exports = router;