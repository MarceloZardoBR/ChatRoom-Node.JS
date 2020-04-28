const chatModel = require('../models/Chat');

module.exports = {

    async storageMessage(chatData){

        const {username, message, activedChat} = chatData.data;
        
        chatModel.findOneAndUpdate({_id: activedChat},
            { $push:{ messages:{'username': username, 'message':message, time: new Date() }}},{upesert: true, new: true},
            (err, file) => {
                if(err){
                    console.log(err)
                }

                
            })
    }
    
}