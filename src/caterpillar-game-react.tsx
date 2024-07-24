import React, { useState, useEffect } from 'react';

// Import the JSON data
import dailyCluesData from './daily-clues.json';

interface Category {
  name: string;
  topic: string;
  clues: string[];
}

interface DailyClue {
  week: number;
  startDate: string;
  categories: Category[];
}

// Assert the type of dailyCluesData
const dailyClues: DailyClue = dailyCluesData as DailyClue;

const CaterpillarGame: React.FC = () => {
  const [score, setScore] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [userGuesses, setUserGuesses] = useState<{ [key: string]: string }>({});
  const [guessedCategories, setGuessedCategories] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    // ... (keep your existing useEffect logic)
  }, [currentDay]);

  const handleInputChange = (categoryName: string, value: string) => {
    setUserGuesses(prev => ({ ...prev, [`${categoryName}`]: value }));
  };

  const handleSubmit = () => {
    let allCorrect = true;
    let newGuessedCategories = new Set(guessedCategories);

    dailyClues.categories.forEach((category) => {
      if (userGuesses[category.name]?.toLowerCase().trim() === category.topic.toLowerCase().trim()) {
        newGuessedCategories.add(category.name);
      } else {
        allCorrect = false;
      }
    });

    setGuessedCategories(newGuessedCategories);

    if (allCorrect || currentDay === 5) {
      const newScore = getScoreEmoji(currentDay);
      setScore(newScore);
      setModalContent(`Game Over! You solved the Caterpillar Game in ${currentDay} day${currentDay > 1 ? 's' : ''}! Your score: ${newScore}`);
      setShowModal(true);
    } else {
      setModalContent(`Day ${currentDay} completed. Keep going!`);
      setShowModal(true);
    }

    setUserGuesses({});  // Clear guesses after submission
  };

  const getScoreEmoji = (day: number): string => {
    switch (day) {
      case 1: return '🦋';
      case 2: return '🍑';
      case 3: return '🍒';
      case 4: return '🍒';
      case 5: return '🍒';
      default: return '';
    }
  };

  const maxClues = (categoryName: string): number => {
    switch (categoryName) {
      case 'Easy': return 3;
      case 'Medium': return 4;
      case 'Hard': return 5;
      default: return 5;
    }
  };

  const shareScore = () => {
    const shareText = `I solved the Caterpillar Game in ${currentDay} days! My score: ${score}`;
    if (navigator.share) {
      navigator.share({
        title: 'Caterpillar Game Score',
        text: shareText,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Score copied to clipboard!');
      }).catch(console.error);
    }
  };


  return (
    <div id="caterpillar-game-container">
      <h1>caterpillar 🐛</h1>
      
      <div id="game-board">
        {dailyClues.categories.map((category, categoryIndex) => {
          const cluesForCategory = maxClues(category.name);
          return (
            <div key={categoryIndex} className="category">
              <h4>{category.name}</h4>
              <div id={`${category.name.toLowerCase()}-clues`} className="clues">
                {category.clues.slice(0, Math.min(currentDay, cluesForCategory)).map((clue, clueIndex) => (
                  <div key={clueIndex} className="clue">
                    <div>{clue}</div>
                  </div>
                ))}
                {Array(Math.max(0, cluesForCategory - currentDay)).fill(null).map((_, index) => (
                  <div key={`hidden-${index}`} className="clue hidden">???</div>
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Enter category guess" 
                value={userGuesses[category.name] || ''}
                onChange={(e) => handleInputChange(category.name, e.target.value)}
                disabled={guessedCategories.has(category.name)}
              />
            </div>
          );
        })}
      </div>

      <div>{countdown}</div>
      
      <button id="submit-button" onClick={handleSubmit} disabled={currentDay > 5 || guessedCategories.size === dailyClues.categories.length}>
        SUBMIT
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalContent}</p>
            {score && <button onClick={shareScore}>Share Score</button>}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaterpillarGame;