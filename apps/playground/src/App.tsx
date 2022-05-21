import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

import logo from './logo.svg';
import './App.css';

function App() {
  const [user, setUser] = useState<Record<string, any> | null>(null);

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginBottom: 10 }}
          >
            Learn React
          </a>
          <GoogleLogin
            onSuccess={credentialResponse => {
              console.log(credentialResponse);
              if (!credentialResponse.credential) return;
              setUser(jwtDecode(credentialResponse.credential));
            }}
          />
          {user && (
            <pre style={{ textAlign: 'left' }}>
              {JSON.stringify(user, null, 2)}
            </pre>
          )}
          {!user && <p>Login</p>}
        </header>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
