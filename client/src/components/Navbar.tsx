import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Yakkun Labs</div>
      <ul className="nav-links">
        <li>Our Services</li>
        <li>Industries</li>
        <li>Company</li>
        <li>Resources</li>
        <li>Careers</li>
        <li>Client Support</li>
      </ul>
      <button className="cta">Let's talk →</button>
    </nav>
  );
};

export default Navbar;
