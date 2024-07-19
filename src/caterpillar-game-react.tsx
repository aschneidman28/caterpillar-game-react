import React, { useState, useEffect } from 'react';

interface Category {
  name: string;
  words: string[];
}

interface GameState {
  categories: Category[];
  currentDay: number;
  score: number;
}

const CaterpillarGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    categories: [],
    currentDay: 1,
    score: 0,
  });

  useEffect(() => {
    // TODO: Fetch categories from an API or load from a local file
    const dummyCategories: Category[] = [
      { name: 'Elements', words: ['Hydrogen', 'Helium', 'Iron', 'Carbon', 'Oxygen'] },
      { name: '20th century American novels', words: ['The Grapes of Wrath', 'The Great Gatsby', 'To Kill a Mockingbird', 'Of Mice and Men', 'The Catcher in the Rye'] },
      { name: 'Debut years of Apple products', words: ['2001', '2007', '2010', '2015', '2023'] },
    ];
    setGameState(prev => ({ ...prev, categories: dummyCategories }));
  }, []);

  const renderClues = (category: Category, difficulty: 'Easy' | 'Medium' | 'Hard') => {
    const maxClues = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 4 : 5;
    return (
      <div className="category">
        <h4>{difficulty}</h4>
        <div className="clues">
          {category.words.slice(0, Math.min(gameState.currentDay, maxClues)).map((word, index) => (
            <div key={index}>{word}</div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div id="caterpillar-game-container">
      <div className="caterpillar">caterpillar 🐛</div>
      <div id="game-board">
        {gameState.categories.map((category, index) => (
          renderClues(category, index === 0 ? 'Easy' : index === 1 ? 'Medium' : 'Hard')
        ))}
      </div>
      <div id="score">Score: {gameState.score}</div>
    </div>
  );
};

export default CaterpillarGame;
