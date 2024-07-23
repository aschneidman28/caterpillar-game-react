import React, { useState, useEffect } from 'react';

// Import the JSON data
import dailyClues from './daily-clues.json';

interface Clue {
  clue: string;
  answer: string;
}

interface Category {
  name: string;
  clues: Clue[];
}

interface DailyClue {
  week: number;
  startDate: string;
  categories: Category[];
}

// Assume dailyClues is an array of DailyClue
const dailyCluesArray: DailyClue[] = dailyClues as unknown as DailyClue[];

const CaterpillarGame: React.FC = () => {
  const [score, setScore] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [userGuesses, setUserGuesses] = useState<{ [key: string]: string }>({});
  const [guessedCategories, setGuessedCategories] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const easternTime = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
      if (easternTime.getHours() === 20 && currentDay < dailyCluesArray[0].categories[0].clues.length) {
        setCurrentDay(prevDay => prevDay + 1);
      }
    
      // Calculate time remaining until next 8pm Eastern Time
      const next8pm = new Date(easternTime);
      next8pm.setHours(20, 0, 0, 0);
      if (easternTime.getHours() >= 20) {
        next8pm.setDate(next8pm.getDate() + 1);
      }
      const diff = next8pm.getTime() - easternTime.getTime();
      const hours = Math.floor(diff / 1000 / 60 / 60);
      const minutes = Math.floor(diff / 1000 / 60) % 60;
      const seconds = Math.floor(diff / 1000) % 60;
    
      setCountdown(`New categories in ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
    }, 1000); // Check every second
  
    return () => clearInterval(intervalId); // Clean up on unmount
  }, [currentDay]);

  const handleInputChange = (categoryNameWithIndex: string, value: string) => {
    setUserGuesses(prev => ({ ...prev, [categoryNameWithIndex]: value }));
  };

  const handleSubmit = () => {
    let allCorrect = true;
    let newGuessedCategories = new Set(guessedCategories);

    dailyCluesArray[currentDay - 1].categories.forEach((category) => {
      category.clues.forEach((clue, index) => {
        const guessKey = `${category.name}${index}`;
        if (userGuesses[guessKey]?.toLowerCase().trim() === clue.answer.toLowerCase().trim()) {
          newGuessedCategories.add(guessKey);
        } else {
          allCorrect = false;
        }
      });
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

  const getScoreEmoji = (day: number) => {
    switch (day) {
      case 1: return '🦋';
      case 2: return '🍑';
      case 3: return '🍒';
      case 4: return '🍒';
      case 5: return '🍒';
      default: return '';
    }
  };

  const getMaxClues = (categoryName: string) => {
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
        {dailyCluesArray[currentDay - 1].categories.map((category, categoryIndex) => {
          const maxClues = getMaxClues(category.name);
          return (
            <div key={categoryIndex} className="category">
              <h4>{category.name}</h4>
              <div id={`${category.name.toLowerCase()}-clues`} className="clues">
                {category.clues.slice(0, Math.min(currentDay, maxClues)).map((clue, clueIndex) => (
                  <div key={clueIndex} className="clue">
                    <div>{clue.clue}</div>
                    <input 
                      type="text" 
                      placeholder="Enter your guess" 
                      value={userGuesses[`${category.name}${clueIndex}`] || ''}
                      onChange={(e) => handleInputChange(`${category.name}${clueIndex}`, e.target.value)}
                      disabled={guessedCategories.has(`${category.name}${clueIndex}`)}
                    />
                  </div>
                ))}
                {Array(Math.max(0, maxClues - currentDay)).fill(null).map((_, index) => (
                  <div key={`hidden-${index}`} className="clue hidden">???</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div>{countdown}</div> {/* Countdown timer */}
      
      <button id="submit-button" onClick={handleSubmit} disabled={currentDay > 5 || guessedCategories.size === dailyCluesArray[currentDay - 1].categories.reduce((total, category) => total + getMaxClues(category.name), 0)}>
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