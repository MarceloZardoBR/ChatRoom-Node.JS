import React from 'react';
import axios from 'axios';

import './DisplayRooms.css';

const DisplayRooms = (props) =>{

    const salas = props.rooms;
    const username = props.username;

    const onHandleClicked = (chat_id) => {
        axios.put('http://localhost:3333/user/chats/join',{
            chat_id: chat_id,
            username: username,
        }).catch(res => {
            alert('Ocorreu um Erro', res.data);
        }).then(res => alert('Sucesso'))
    }

    return(
        <div className={'display-container'}>
            <p>Salas Disponíveis</p>
            <ul>
                {salas.map((sala, index) => (
                <li key={sala._id}>
                    <button onClick={() => onHandleClicked(sala._id)}>{sala.roomName}</button>
                </li>
                ))}
            </ul>
        </div>
    )
};

export default DisplayRooms;