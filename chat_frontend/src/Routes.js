import React from 'react'

import Login from './Login';
import App from './App';

import {
    BrowserRouter,
    Route
} from 'react-router-dom';

const Routes = () =>{
    return(
        <BrowserRouter>
            <Route path='/' exact component={Login} />
            <Route path='/rooms/:username' component={App} />
        </BrowserRouter>
    )
}

export default Routes;