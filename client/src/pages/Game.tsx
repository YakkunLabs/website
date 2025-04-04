import React from 'react';
import '../styles/Game.css'; // Make sure the styles are linked properly
import img_02 from '../assets/img_02.png';
import img_03 from '../assets/img_03.png';

const Game = () => {
  return (
    <div className="game-page">
      <h1>Our Games</h1>
      <p>Explore our exciting games, 'Ravana Defense' and 'Ravana Dungeons'!</p>

      <div className="games-container">
        <div className="game-card">
          <img src={img_02} alt="Ravana Defense" />
          <div className="game-info">
            <h3 className="game-title">Ravana Defense</h3>
            <p className="game-price">$50</p>
            <a href="/play" className="game-link">Play Now</a>
          </div>
        </div>

        <div className="game-card">
          <img src={img_03} alt="Ravana Dungeons" />
          <div className="game-info">
            <h3 className="game-title">Ravana Dungeons</h3>
            <p className="game-price">$75</p>
            <a href="/play" className="game-link">Play Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
