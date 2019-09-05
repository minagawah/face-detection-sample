import React from 'react';
import { Link } from 'react-router-dom';

// import logo from './logo.svg';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>face-detection-sample</h1>
      </header>
      <div className="app-nav">
        <Link to="/">[ Top ]</Link>
        <Link to="/face">[ Face ]</Link>
      </div>
    </div>
  );
}

export default App;
