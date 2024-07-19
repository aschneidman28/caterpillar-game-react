import React, { useState } from 'react';

const CaterpillarGame = () => {
  const [score, setScore] = useState(0);
  
  // Example data - replace with your actual game logic
  const categories = [
    { name: 'Easy', clues: ['Hydrogen', '???', '???'] },
    { name: 'Medium', clues: ['The Grapes of Wrath', '???', '???', '???'] },
    { name: 'Hard', clues: ['2001', '???', '???', '???', '???'] }
  ];

  return (
    <div id="caterpillar-game-container">
      <h1>Caterpillar Game</h1>
      <div className="caterpillar">caterpillar 🐛</div>
      
      <div id="game-board">
        {categories.map((category, index) => (
          <div key={index} className="category">
            <h4>{category.name}</h4>
            <div id={`${category.name.toLowerCase()}-clues`} className="clues">
              {category.clues.map((clue, clueIndex) => (
                <div key={clueIndex} className={`clue ${clue === '???' ? 'hidden' : ''}`}>
                  {clue}
                </div>
              ))}
            </div>
            <div className="input-area">
              <input type="text" placeholder="Enter your guess" />
            </div>
          </div>
        ))}
      </div>
      
      <button id="submit-button">SUBMIT</button>
      
      <div id="score">
        Score: {score}
      </div>
      
      <div id="message-display" className="hidden">
        {/* Add message display logic here */}
      </div>
    </div>
  );
};

export default CaterpillarGame;
