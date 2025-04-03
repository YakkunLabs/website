import '../styles/Page.css';
import image from '../assets/portfolio-4.jpg';

const Services = () => (
  <div className="page">
    <h1>Our Services</h1>
    <img src={image} alt="Services" />
    <p>From concept art to game engine optimization, we provide full-cycle game development services.</p>
  </div>
);

export default Services;
