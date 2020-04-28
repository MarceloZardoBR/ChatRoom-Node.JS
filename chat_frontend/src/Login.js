import React, { useState } from 'react';
import './Login.css';

const Login = ({history}) =>{

    const [username, setUsername] = useState('');

    const onHandleJoin = () => {
        if(username){
            history.push(`/rooms/${username}`)
        } 
    }

    return(
        <div className='login-container'>
            <input placeholder={'Username'} value={username} onChange={e => setUsername(e.target.value)}/>
            <button onClick={onHandleJoin}>Entrar</button>
        </div>
    )
}

export default Login;