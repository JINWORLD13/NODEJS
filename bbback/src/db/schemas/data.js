const { Schema } = require("mysql");

const HappySchema = new Schema(
    {
        '지역구' : {
            type: String,
            required: true,
        },
        '종합' : {
            type: Number,
            required: true,
        },
        '개인 건강상태' : {
            type: Number,
            required: true,
        },
        '개인 재정상태' : {
            type: Number,
            required: true,
        },
        '관계성' : {
            type: Number,
            required: true,
        },
        '가정생활' : {
            type: Number,
            required: true,
        },
        '사회생활' : {
            type: Number,
            required: true,
        },
        DataId : {
            type: int,
            required: true,
        }
    }
);

const CultureSchema = new Schema(
    {
        '문화환경 만족도' : {
            type: Number,
            required: true,
        },
        '문화시설' : {
            type: Number,
            required: true,
        },
        '문화프로그램' : {
            type: Number,
            required: true,
        },
        '문화비용' : {
            type: Number,
            required: true,
        }
    }
);


module.exports = {HappySchema, CultureSchema};
