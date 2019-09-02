import React from 'react';
import logo from './logo.svg';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>face-detection-sample</h1>
        <img src={logo} className="app-logo" alt="logo" />
      </header>
      <div className="app-nav">
        <a href="/">[ Top ]</a>
      </div>
    </div>
  );
}

export default App;
