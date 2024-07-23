import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/components/ui/modal';

// Import the JSON data
import weeklyClues from './weekly-clues.json';

interface Clue {
  name: string;
  topic: string;
  clues: string[];
}

const CaterpillarGame: React.FC = () => {
  const [score, setScore] = useState('');
  const [currentDay, setCurrentDay] = useState(1);
  const [categories, setCategories] = useState<Clue[]>([]);
  const [userGuesses, setUserGuesses] = useState<{ [key: string]: string }>({});
  const [guessedCategories, setGuessedCategories] = useState<Set<string>>(new Set());
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCategories(weeklyClues.categories);
  }, []);

  const handleInputChange = (categoryName: string, value: string) => {
    setUserGuesses(prev => ({ ...prev, [categoryName]: value }));
  };

  const handleSubmit = () => {
    let allCorrect = true;
    let newGuessedCategories = new Set(guessedCategories);

    categories.forEach(category => {
      if (!guessedCategories.has(category.name) &&
          userGuesses[category.name]?.toLowerCase().trim() === category.topic.toLowerCase().trim()) {
        newGuessedCategories.add(category.name);
      } else {
        allCorrect = false;
      }
    });

    setGuessedCategories(newGuessedCategories);

    if (allCorrect) {
      setScore(getScoreEmoji(currentDay));
      setShowModal(true);
    } else {
      setCurrentDay(prev => Math.min(prev + 1, 5));
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
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Score copied to clipboard!');
      }).catch(console.error);
    }
  };

  return (
    <div id="caterpillar-game-container">
      <h1>caterpillar 🐛</h1>
      
      <div id="game-board">
        {categories.map((category, index) => {
          const maxClues = getMaxClues(category.name);
          return (
            <div key={index} className="category">
              <h4>{category.name}</h4>
              <div id={`${category.name.toLowerCase()}-clues`} className="clues">
                {category.clues.slice(0, Math.min(currentDay, maxClues)).map((clue, clueIndex) => (
                  <div key={clueIndex} className="clue">
                    {clue}
                  </div>
                ))}
                {Array(Math.max(0, maxClues - currentDay)).fill(null).map((_, index) => (
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
          );
        })}
      </div>
      
      <button id="submit-button" onClick={handleSubmit} disabled={currentDay > 5}>SUBMIT</button>
      
      <div id="day-display">
        Day: {currentDay}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <h2>Congratulations!</h2>
        <p>You solved all categories in {currentDay} day{currentDay > 1 ? 's' : ''}!</p>
        <p>Your score: {score}</p>
        <Button onClick={shareScore}>Share Score</Button>
      </Modal>
    </div>
  );
};

export default CaterpillarGame;
