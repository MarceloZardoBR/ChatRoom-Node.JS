const express = require('express');

const chatController = require('./controllers/ChatController');

const routes = express.Router();

routes.get('/user/chats/', chatController.getUserChats);
routes.get('/chats/get', chatController.getAllRooms);
routes.post('/chats/new', chatController.createNewRoom);
routes.put('/user/chats/join', chatController.joinRoom);

module.exports =  routes;