const ChatModel = require('../models/Chat');

module.exports = {

    async getUserChats(req, res){

        const { username } = req.query;

        const io = req.io;
        
        const chats = await ChatModel.find({ 'participants': username });

        const data = {
            roomName: username,
            participants:[
                username
            ]
        }

        if(chats[0] == undefined){
            ChatModel.create(data).catch(err => console.log(err))
                .then(response => {
                    res.send(response);
                });
        }

        res.send(chats);
    },

    async joinRoom(req, res){

        const { username, chat_id } = req.body;

        ChatModel.findOneAndUpdate({_id: chat_id},
            { $push:{ participants: username }},{upsert: true, new: true},
            (err, doc) => {
                if(err){
                    res.status(500).send(err);
                }else {
                    res.status(200).send('OK');
                }
            })
    },

    async getAllRooms(req, res){

        const rooms = await ChatModel.find({},{_id: 1, roomName: 1});

        if(!rooms){
            res.status(500).send('Ocorreu um erro');
        }else{
            res.send(rooms);
        }
    },

    async createNewRoom(req, res){

        const { username, room_name } = req.body;

        const room = ChatModel.find({ roomName: room_name });

        if(!room && !room_name.trim() && room_name !== null){

            const data = {
                roomName: room_name,
                participants:[
                    username
                ]
            }
    
            ChatModel.create(data).catch(err => {
                res.status(500).send(err);
            }).then(() => {
                res.status(200).send('OK');
            })

        }else {
            res.status(409).send('Room with this name already exits or the name cant be white spaces!')
        }
    }
}