const { Schema } = require("mysql");

const HappySchema = new Schema(
    {
        지역구 : {
            type: String,
            required: true,
        },
        종합 : {
            type: Number,
            required: true,
        },
        DataId : {
            type: Number,
            required: true,
        }
    }
);

const CultureSchema = new Schema(
);

module.exports = UserSchema;
