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

  useEffect(() => {
    // Initialize the game with the current week's clues
    setCategories(weeklyClues.categories);
  }, []);

  const handleInputChange = (categoryName: string, value: string) => {
    setUserGuesses(prev => ({ ...prev, [categoryName]: value }));
  };

  const handleSubmit = () => {
    let newScore = score;
    categories.forEach(category => {
      if (userGuesses[category.name]?.toLowerCase() === category.topic.toLowerCase()) {
        // Calculate score based on the current day and category difficulty
        const pointsEarned = calculatePoints(category.name, currentDay);
        newScore += pointsEarned;
        // You might want to add some visual feedback here
      }
    });
    setScore(newScore);
    // Move to the next day
    setCurrentDay(prev => Math.min(prev + 1, 5));
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
            <div className="clues">
              {category.clues.slice(0, currentDay).map((clue, clueIndex) => (
                <div key={clueIndex} className="clue">
                  {clue}
                </div>
              ))}
            </div>
            <div className="input-area">
              <input 
                type="text" 
                placeholder="Enter your guess" 
                value={userGuesses[category.name] || ''}
                onChange={(e) => handleInputChange(category.name, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button onClick={handleSubmit}>SUBMIT</button>
      
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
