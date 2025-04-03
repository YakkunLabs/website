import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="navbar">
      <div className="logo">🎮 Yakkun Labs</div>
      <nav>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/company">About</Link></li>
          <li><Link to="/services">Service</Link></li>
          <li><Link to="/resources">Portfolio</Link></li>
          <li><Link to="/industries">Pricing</Link></li>
          <li><Link to="/careers">Pages</Link></li>
          <li><Link to="/support">Contact</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
export {}; // ✅ Fix for isolatedModules
