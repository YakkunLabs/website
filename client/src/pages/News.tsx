import React from 'react';
import '../styles/News.css';

const newsData = [
  {
    title: 'Ravana Defense Released!',
    date: 'April 1, 2025',
    description: 'We are thrilled to announce the release of our latest game, Ravana Defense. Dive into this epic strategy game now!',
    image: require('../assets/slider-1.png'), // Import image correctly
  },
  {
    title: 'New Update for Ravana Dungeons',
    date: 'March 28, 2025',
    description: 'Ravana Dungeons gets a major update! Explore new dungeons, items, and enemies.',
    image: require('../assets/slider-2.png'), // Import image correctly
  },
  {
    title: 'Join Our Team at Yakkun Labs',
    date: 'March 25, 2025',
    description: 'We are hiring! If you are a passionate developer or designer, apply now to join our dynamic team.',
    image: require('../assets/slider-3.png'), // Import image correctly
  },
];

const News = () => {
  return (
    <div className="news-page">
      <h1>Latest News</h1>
      <div className="news-container">
        {newsData.map((newsItem, index) => (
          <div className="news-card" key={index}>
            <img src={newsItem.image} alt={newsItem.title} className="news-image" />
            <div className="news-info">
              <h3 className="news-title">{newsItem.title}</h3>
              <p className="news-date">{newsItem.date}</p>
              <p className="news-description">{newsItem.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
