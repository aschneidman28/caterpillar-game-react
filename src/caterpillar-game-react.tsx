import React, { useState, useEffect } from 'react';

// Import the JSON data
import weeklyClues from './weekly-clues.json';

interface Clue {
  name: string;
  topic: string;
  clues: string[];
}

const CaterpillarGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentDay, setCurrentDay] = useState(1);
  const [categories, setCategories] = useState<Clue[]>([]);
  const [userGuesses, setUserGuesses] = useState<{ [key: string]: string }>({});
  const [guessedCategories, setGuessedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCategories(weeklyClues.categories);
  }, []);

  const handleInputChange = (categoryName: string, value: string) => {
    setUserGuesses(prev => ({ ...prev, [categoryName]: value }));
  };

  const handleSubmit = () => {
    let newScore = score;
    let newGuessedCategories = new Set(guessedCategories);

    categories.forEach(category => {
      if (!guessedCategories.has(category.name) &&
          userGuesses[category.name]?.toLowerCase().trim() === category.topic.toLowerCase().trim()) {
        const pointsEarned = calculatePoints(category.name, currentDay);
        newScore += pointsEarned;
        newGuessedCategories.add(category.name);
      }
    });

    setScore(newScore);
    setGuessedCategories(newGuessedCategories);
    setCurrentDay(prev => Math.min(prev + 1, 5));
    setUserGuesses({});  // Clear guesses after submission
  };

  const calculatePoints = (categoryName: string, day: number) => {
    const pointsTable = {
      Easy: [3, 2, 1, 1, 1],
      Medium: [4, 3, 2, 2, 1],
      Hard: [5, 4, 3, 2, 1]
    };
    return pointsTable[categoryName as keyof typeof pointsTable][day - 1];
  };

  return (
    <div id="caterpillar-game-container">
      <h1>caterpillar 🐛</h1>
      
      <div id="game-board">
        {categories.map((category, index) => (
          <div key={index} className="category">
            <h4>{category.name}</h4>
            <div id={`${category.name.toLowerCase()}-clues`} className="clues">
              {category.clues.slice(0, currentDay).map((clue, clueIndex) => (
                <div key={clueIndex} className="clue">
                  {clue}
                </div>
              ))}
              {Array(Math.max(0, 5 - currentDay)).fill(null).map((_, index) => (
                <div key={`hidden-${index}`} className="clue hidden">???</div>
              ))}
            </div>
            <div className="input-area">
              <input 
                type="text" 
                placeholder="Enter your guess" 
                value={userGuesses[category.name] || ''}
                onChange={(e) => handleInputChange(category.name, e.target.value)}
                disabled={guessedCategories.has(category.name)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button id="submit-button" onClick={handleSubmit} disabled={currentDay > 5}>SUBMIT</button>
      
      <div id="score">
        Score: {score}
      </div>
      
      <div id="day-display">
        Day: {currentDay}
      </div>
    </div>
  );
};

export default CaterpillarGame;
