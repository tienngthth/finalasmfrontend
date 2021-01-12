import React, { useState } from 'react';

export default function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const validateCredentialEndpoint = 'http://localhost:8989/login/password'
    const googleAuthenticationEndpoint = 'http://localhost:8989/login/email'

    const validateLogin = () => {
        fetch(validateCredentialEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Method': 'POST'
            },
            body: JSON.stringify({username: username, password: password})
        })
        .then(res =>  res.json())
        .then(data => console.log(data))
    }

    return (
        <div>
            <label>
                Username
            </label>
            <input
                type="text"
                value={ username }
                onChange={ (e) => setUsername(e.target.value)}
            />
            <label>
                Password
            </label>
            <input
                type="text"
                value={ password }
                onChange={ (e) => setPassword(e.target.value)}
            />
            <button onClick={ () => validateLogin() }>Login</button>
            <a href={ googleAuthenticationEndpoint }>
                <button >Login with Google</button>
            </a>
        </div>
    )
}
