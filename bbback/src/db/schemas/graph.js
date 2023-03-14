const { Schema } = require("mongoose");

const GraphSchema = new Schema({
    Gu : {
        type: String,
        required: true
    },
    total : {
        type: Number,
        required: true
    },
    health : {
        type: Number,
        required: true
    },
    relation : {
        type: Number,
        required: true
    },
    family : {
        type: Number,
        required: true
    },
    social : {
        type: Number,
        required: true
    }
});

module.exports = GraphSchema;