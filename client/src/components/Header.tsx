import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import { FaTwitter, FaDiscord, FaLinkedin } from 'react-icons/fa'; // Social media icons

const Header = () => {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo">Yakkun Labs</Link>
      </div>

      <div className="search-bar-container">
        <input type="text" className="search-bar" placeholder="Search items and games" />
      </div>

      <nav className="nav">
        <Link to="/store" className="nav-item">Store</Link>
        <Link to="/games" className="nav-item">Games</Link>
        <Link to="/news" className="nav-item">News</Link>
      </nav>

      <div className="auth-btns">
        <Link to="/signup" className="btn signup-btn">Sign Up</Link>
        <Link to="/login" className="btn login-btn">Login</Link>
      </div>

      <div className="social-media">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        <a href="https://discord.com" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
      </div>
    </header>
  );
};

export default Header;
