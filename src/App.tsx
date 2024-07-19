import React from 'react';
import './App.css';
import CaterpillarGame from './caterpillar-game-react.ts';  // Add the .tsx extension

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Caterpillar Game</h1>
        <CaterpillarGame />
      </header>
    </div>
  );
}

export default App;
