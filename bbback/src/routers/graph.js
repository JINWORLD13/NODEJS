const express = require("express");
const router = express.Router();
const { Graph } = require("../db/models/model");

router.get('/', (req, res) => {
    res.send('data');
})

router.get('/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const graph = await Graph.findOne({ _id: id });
        res.status(200).json(graph);
    } catch (err) {
        console.error(err);
        res.send('그래프 조회가 실패하였습니다.');
    }
})

module.exports = router;