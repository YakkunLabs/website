import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo">Yakkun Labs</Link>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/industries">Pricing</Link>
        <Link to="/company">About</Link>
        <Link to="/resources">Portfolio</Link>
        <Link to="/careers">Careers</Link>
        <Link to="/support">Support</Link>
      </nav>
    </header>
  );
};

export default Header;
