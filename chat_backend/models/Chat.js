const { Schema, model } = require('mongoose');

const chatSchema = new Schema({
    roomName:{
        type: String,
        required: true
    },
    participants:[{
        type: String,
        required: true
    }],
    messages:[{
        user_id: String,
        message: String,
        time: Date
    }]
})

module.exports = model('chat', chatSchema);
