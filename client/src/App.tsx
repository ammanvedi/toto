import React from 'react';
import logo from './logo.svg';
import './App.css';

const App: React.FC = () => {
  console.log(process.env);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <video controls>
          <source src={`http://${window.location.hostname}:${process.env.TOTO_SERVER_PORT}/video/4589010c95930169b23c9a3c02777575c3754a0c`} type="video/mp4" />
        </video>
        <p>
          we will talk to the api @
          {window.location.hostname}:{process.env.TOTO_SERVER_PORT}
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
      </header>
    </div>
  );
}

export default App;
