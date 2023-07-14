import config  from './config';
import './App.css';
import api from './api.js';
import { gql } from '@apollo/client';
import { useState } from 'react';

//var email = 'user1@example.com';
//var password = 'aaa';

function App() {

  const [email, setEmail] = useState('user1@example.com');
  const [password, setPassword] = useState('aaa');
  const [loggedIn, setLoggedIn] = useState('');

  function me() {
    api
    .mutate({
      mutation: gql(`
      query Me {
        me {
          id
          email
        }
      }
      `),
    })
    .then((result) => {console.log(result);
      setLoggedIn(result.data.me ? result.data.me.email: 'Nobody');
    });
  }
  
  function logout() {
    fetch(config.API_URL+'/logout', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({})
    }).then((rawResponse) => {
      rawResponse.json().then((res) => {
        console.log('loggedOut', res);
      });
    });
  }
  
  function login() {
  
    fetch(config.API_URL+'/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({login: email, password: password})
    }).then((rawResponse) => {
      rawResponse.json().then((res) => {
        console.log('loggedIn', res);
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          JWT token long-term cookie authorization, with GraphQL Apollo Client & Server
          
        </p>
        <div>Logged In: {loggedIn} <button onClick={me}>Refresh</button></div>
        <input placeholder="Email" value={email} onChange={setEmail}></input>
        <input placeholder="Password" value={password} onChange={setPassword}></input>
        <button onClick={login}>Login</button>
        <button onClick={logout}>Logout</button>
      </header>
    </div>
  );
}

export default App;
