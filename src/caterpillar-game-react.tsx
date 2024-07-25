import React, { useState, useEffect } from 'react';

// Import the JSON data
import dailyCluesData from './daily-clues.json';

interface Category {
  topic: string;
  clues: string[];
}

interface DailyClue {
  day: number;
  startDate: string;
  category: Category;
}

interface CluesData {
  clues: DailyClue[];
}

// Assert the type of dailyCluesData
const cluesData: CluesData = dailyCluesData as CluesData;

// Hours when each clue is released
const clueHours = [8, 12, 16, 20];

const CaterpillarGame: React.FC = () => {
  const [currentClue, setCurrentClue] = useState<DailyClue | null>(null);
  const [visibleClues, setVisibleClues] = useState(0);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [countdown, setCountdown] = useState('');
  const [gameWon, setGameWon] = useState(false);
  const [currentDate, setCurrentDate] = useState('');
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Only show game Monday-Friday
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dateString = today.toISOString().split('T')[0];
      const todayClue = cluesData.clues.find(clue => clue.startDate === dateString);
      if (todayClue) {
        setCurrentClue(todayClue);
        setWordCount(todayClue.category.topic.split(' ').length);
        setCurrentDate(today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
      }
    } else {
      setCurrentClue(null);
      setCurrentDate('No game today. Come back on Monday!');
    }
  }, []);

  useEffect(() => {
    const updateVisibleClues = () => {
      const currentHour = new Date().getHours();
      const newVisibleClues = clueHours.filter(hour => currentHour >= hour).length;
      setVisibleClues(newVisibleClues);
    };

    updateVisibleClues();
    const interval = setInterval(updateVisibleClues, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (value: string) => {
    setUserGuess(value);
  };

  const handleSubmit = () => {
    if (!currentClue) return;

    if (userGuess.toLowerCase().trim() === currentClue.category.topic.toLowerCase().trim()) {
      const newScore = getScoreEmoji(visibleClues);
      setScore(newScore);
      setModalContent(`Congratulations! You've guessed correctly. You've won a ${newScore}`);
      setShowModal(true);
      setGameWon(true);
    } else if (visibleClues === 4) {
      setModalContent(`Sorry, that's not correct. The answer was: ${currentClue.category.topic}`);
      setShowModal(true);
    } else {
      setModalContent(`That's not correct. Keep trying!`);
      setShowModal(true);
    }

    setUserGuess('');  // Clear guess after submission
  };

  const getScoreEmoji = (cluesRevealed: number): string => {
    switch (cluesRevealed) {
      case 1: return '🦋';
      case 2: return '🍑';
      case 3: return '🍐';
      case 4: return '🍒';
      default: return '';
    }
  };

  const shareScore = () => {
    const shareText = `I solved the Caterpillar Game! My score: ${score}`;
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

  if (!currentClue) {
    return <div id="caterpillar-game-container">
      <h1>caterpillar 🐛</h1>
      <p>{currentDate}</p>
    </div>;
  }

  return (
    <div id="caterpillar-game-container">
      <h1>caterpillar 🐛</h1>
      <p>{currentDate}</p>
      
      <div id="game-board">
        <div className="category">
          <div id="clues" className="clues">
            {currentClue.category.clues.map((clue, index) =>
              (index < visibleClues) ?
              <div key={index} className="clue">{clue}</div> :
              <div key={`hidden-${index}`} className="clue hidden">???</div>
            )}
          </div>
          <p>Hint: The answer has {wordCount} word{wordCount > 1 ? 's' : ''}</p>
          <input 
            type="text" 
            placeholder="Enter category guess" 
            value={userGuess}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={gameWon}
          />
        </div>
      </div>

      <div>{countdown}</div>
      
      <button id="submit-button" onClick={handleSubmit} disabled={gameWon}>
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
